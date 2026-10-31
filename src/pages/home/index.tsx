import { Container } from "../../components/container"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { CarsImg } from "../../components/carsImg"

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
  onLoad?: () => void;
  style?: React.CSSProperties;
}

export function Home() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarProps[]>([]);
  const [loadimages, setLoadImages] = useState<string[]>([]);
  const [search, setSearch] = useState("");

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
        setFilteredCars(carsList);
      } catch (error) {
        console.error("Erro ao carregar os carros:", error)
      }
    }

    loadCars()
  }, [])

  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
  }

  async function handleSearch() {
    if (search === "") {
      setFilteredCars(cars)
      return
    }
    const result = cars.filter((car) =>
      `${car.name} ${car.model}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )

    if (result.length === 0) {
      setFilteredCars(cars)
      setSearch("")
      return
    }


    setFilteredCars(result)
  }

  return (
    <Container>
      <section className=" mt-4 bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          placeholder="Digite o nome do carro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-red-500 h-9 px-10 rounded-lg text-white font-medium text-lg"
        >
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em Portugal Continente e Madeira
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCars.map((car) => (
          <Link key={car.id} to={`/car/${car.id}`}>
            <section className="w-full bg-white rounded-lg overflow-hidden">
              <div
                className="w-full h-72 rounded-lg bg-slate-200"
                style={{
                  display: loadimages.includes(car.id) ? "none" : "block",
                }}
              ></div>

              {car.images && car.images.length > 0 ? (
                <CarsImg
                  images={car.images ?? []}
                  name={car.name}
                  onLoad={() => handleImageLoad(car.id)}
                  style={{
                    display: loadimages.includes(car.id) ? "block" : "none",
                  }}
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">
                    Sem imagem disponível
                  </span>
                </div>
              )}

              <p className="font-bold mt-1 mb-2 px-2">
                {car.name} {car.model}
              </p>

              {/*
              <p className="text-gray-600 text-sm px-2 mb-3">
                {car.description || "Sem descrição disponível."}
              </p>
              */}

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
  );
}