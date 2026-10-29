import { Container } from "../../components/container";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { CarsImg } from "../../components/carsImg";

export function Home() {
  interface CarProps {
    id: string;
    name: string;
    model: string;
    description: string;
    year: string;
    uid: string;
    km: string;
    price: string;
    city: string;
    images: string[];
  }

  const [cars, setCars] = useState<CarProps[]>([]);

  useEffect(() => {
    async function loadCars() {
      try {
        const carsRef = collection(db, "cars");
        const snapshot = await getDocs(carsRef);

        const carsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CarProps[];

        setCars(carsList);

        console.table(
          carsList.map((car) => ({
            id: car.id,
            nome: car.name,
            modelo: car.model,
            description: car.description,
            quantidadeImagens: car.images?.length ?? 0,
          }))
        );
      } catch (error) {
        console.error("Erro ao carregar os carros:", error);
      }
    }

    loadCars();
    
  }, []);

  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="w-full border-2 rounded-lg h-9 px-3"
          placeholder="Digite o nome do carro..."
        />
        <button
          className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
        >
          Buscar
        </button>
      </section>
      
      <h1
        className="font-bold text-center mt-6 text-2xl mb-4"
      >
        Carros novos e usados em  Portugal Continente e Madeira
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">


        {cars.map((car) => (
          <Link key={car.id} to ={`/car/${car.id}`}>
            <section  className="w-full bg-white rounded-lg overflow-hidden">
              {car.images && car.images.length > 0 ? (
                <CarsImg
                  images={car.images ?? []}
                  name={car.name}
                  onLoad={ () => handleImageLoadcar.id) }
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Sem imagem disponível</span>
                </div>
              )}

              <p className="font-bold mt-1 mb-2 px-2">
                {car.name} {car.model}
              </p>

              {/* 
              <p className="text-gray-600 text-sm px-2 mb-3">
                {car.description || "Sem descrição disponível."}
              </p>*/}

              <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-6">
                  {car.year} | {car.km} km
                </span>

                <strong className="text-black font-medium text-xl">
                  {car.price} €
                </strong>
              </div>

              <div className="w-full h-px bg-slate-200 my-2" />

              <div className="px-2 pb-2">
                <span className="text-black">{car.city}</span>
              </div>
            </section>
          </Link>
        ))}

      </main>
    </Container>
  )
}

