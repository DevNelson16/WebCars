import { useEffect, useState } from "react";
import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/panelheader";
import { CarsImg } from "../../components/carsImg";
import { FiTrash } from "react-icons/fi";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../../services/firebaseConnection";

interface CarProps {
  id: string;
  name: string;
  model: string;
  description: string;
  year: string;
  km: string;
  price: string;
  city: string;
  images: string[];
  userId: string;
}

export function Dashboard() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCars() {
      try {
        const user = auth.currentUser;

        if (!user) {
          setCars([]);
          return;
        }

        const carsRef = collection(db, "cars");
        const carQuery = query(
          carsRef,
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(carQuery);

        const carsList = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as CarProps[];

        setCars(carsList);
      } catch (error) {
        console.error("Erro ao carregar os anúncios:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCars();
  }, []);

  async function handleDeleteCar(id: string) {
    const confirmDelete = window.confirm(
      "Tens a certeza de que queres eliminar este anúncio?"
    );

    if (!confirmDelete) return;

    try {
      const user = auth.currentUser;

      if (!user) {
        alert("Tens de iniciar sessão para eliminar um anúncio.");
        return;
      }

      const carToDelete = cars.find((car) => car.id === id);

      if (!carToDelete || carToDelete.userId !== user.uid) {
        alert("Não tens autorização para eliminar este anúncio.");
        return;
      }


      const token = await user.getIdToken();


      const response = await fetch(
        "https://mmzlzlzptjkcthobdaya.supabase.co/functions/v1/swift-endpoint",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            images: carToDelete.images ?? [],
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Não foi possível eliminar as fotografias."
        );
      }

      await deleteDoc(doc(db, "cars", id));


      setCars((previousCars) =>
        previousCars.filter((car) => car.id !== id)
      );

      alert("Anúncio e fotografias eliminados com sucesso!");
    } catch (error) {
      console.error("Erro ao eliminar o anúncio:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao eliminar o anúncio."
      );
    }
  }

  return (
    <Container>
      <DashboardHeader />

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-gray-500">A carregar os teus anúncios...</p>
        ) : cars.length === 0 ? (
          <p className="text-gray-500">
            Ainda não tens anúncios publicados.
          </p>
        ) : (
          cars.map((car) => (
            <section
              key={car.id}
              className="w-full bg-white rounded-lg overflow-hidden shadow-sm"
            >
              {car.images && car.images.length > 0 ? (
                <CarsImg images={car.images} name={car.name} />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">
                    Sem imagem disponível
                  </span>
                </div>
              )}

              <div className="p-3">
                <h2 className="font-bold text-lg">
                  {car.name} {car.model}
                </h2>

                <p className="text-gray-600 text-sm mt-1">
                  {car.description || "Sem descrição disponível."}
                </p>

                <p className="text-gray-700 mt-3">
                  {car.year} | {car.km} km
                </p>

                <strong className="block text-xl mt-2">
                  {car.price} €
                </strong>

                <p className="text-gray-600 mt-1">{car.city}</p>

                <button
                  type="button"
                  onClick={() => handleDeleteCar(car.id)}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                >
                  <FiTrash size={18} />
                  Eliminar anúncio
                </button>
              </div>
            </section>
          ))
        )}
      </main>
    </Container>
  );
}