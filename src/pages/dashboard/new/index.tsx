import { useContext, type ChangeEvent, useState } from "react";
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/panelheader";

import { FiUpload, FiTrash } from "react-icons/fi";
import { useForm } from "react-hook-form"
import { Input } from "../../../components/input";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "../../../contexts/AuthContext";
import { v4 as uuidv4 } from 'uuid'

import { db, auth } from "../../../services/firebaseConnection";
import { collection, addDoc } from "firebase/firestore";

const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  model: z.string().nonempty("O modelo é obrigatório"),
  year: z.string().nonempty("O ano é obrigatório"),
  km: z.string().nonempty("A KM é obrigatória"),
  price: z.string().nonempty("O preço é obrigatório"),
  city: z.string().nonempty("A cidade é obrigatória"),
  whatsapp: z.string().nonempty("O tefone é obrigatório").refine((value) => /^(\d{9,10})$/.test(value), {
    message: "Número de telefone inválido."
  }),
  description: z.string().nonempty("A descrição é obrigatória")
})

type FormData = z.infer<typeof schema>;

interface ImagemItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export function New() {
  const { user } = useContext(AuthContext)
  const [images, setImages] = useState<string[]>([])
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  const [carImageSet] = useState<ImagemItemProps[]>([])

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0]

      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        await handleUpload(image)
      } else {
        alert("envie uma imagem jpeg ou png!")
        return
      }
    }
  }


  async function handleUpload(image: File) {
    if (!user?.uid) {
      alert("Tens de iniciar sessão para enviar imagens.");
      return;
    }

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert("Tens de iniciar sessão para enviar imagens.");
        return;
      }

      const token = await currentUser.getIdToken();


      const formData = new FormData();
      formData.append("image", image);


      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-car-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Erro no upload:", result);
        alert(result.error ?? "Não foi possível enviar a imagem.");
        return;
      }

      console.log("Imagem enviada com sucesso:", result.publicUrl);
      setImages((prev) => [...prev, result.publicUrl])
      //alert("Imagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      alert("Ocorreu um erro ao enviar a imagem.");
    }
  }

  async function onSubmit(data: FormData) {
    if (!user?.uid) {
      alert("Tens de iniciar sessão para cadastrar o carro.");
      return;
    }

    const car = {
      ...data,
      userId: user.uid,
      images: images
    }

    try {
      await addDoc(collection(db, "cars"), car)
      alert("Carro cadastrado com sucesso!")
      reset()
      setImages([])
    } catch (error) {
      console.error("Erro ao cadastrar carro: ", error)
      alert("não foi possivle cadastrar o carro!")
    }
  }


  function handleDeleteImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }


  return (
    <Container>
      <DashboardHeader />

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-start gap-4">
        <label className="border-2 w-48 rounded-lg flex flex-col items-center justify-center cursor-pointer border-gray-600 h-32 shrink-0">
          <FiUpload size={30} color="#000" />
          <span className="text-sm mt-2">Selecionar imagem</span>

          <input
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handleFile}
          />
        </label>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <button
                  type="button"
                  className="absolute right-1 top-1 bg-red-600 rounded p-1"
                  onClick={() => handleDeleteImage(index)}
                  aria-label="Remover imagem"
                >
                  <FiTrash size={20} color="#FFF" />
                </button>
                <img
                  src={image}
                  alt={`Imagem do carro ${index + 1} `}
                  className="w-32 h-24 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form
          className="w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <p className="mb-2 font-medium">Nome do carro</p>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Ex: Onix 1.0"
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Modelo do carro</p>
            <Input
              type="text"
              register={register}
              name="model"
              error={errors.model?.message}
              placeholder="Ex: 1.0 Flex Plus Manual"
            />
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Ano</p>
              <Input
                type="text"
                register={register}
                name="year"
                error={errors.year?.message}
                placeholder="Ex: 2021/2022"
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">KM Percorrido</p>
              <Input
                type="text"
                register={register}
                name="km"
                error={errors.km?.message}
                placeholder="Ex: 23.900km"
              />
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Telemovel</p>
              <Input
                type="text"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                placeholder="Ex: 9xx-xxx-xxx"
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Ex: Lisboa / Porto"
              />
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Preço</p>
            <Input
              type="text"
              register={register}
              name="price"
              error={errors.price?.message}
              placeholder="Ex: 100€ - 300.000€"
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="border-2 w-full rounded-md h-24 px-2"
              {...register("description")}
              name="description"
              id="description"
              placeholder="Digite a descrição completa sobre o carro..."
            />
            {errors.description && (
              <p className="mb-2 text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 text-white font-medium h-10"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </Container>
  )
}