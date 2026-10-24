import { Container } from "../../components/container";

export function Home() {
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


        <section className="w-full bg-white rounded-lg">
          <img
            className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
            src="https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6Ijk1OWxuczB4cjZqMi1TVERWVExQVCIsInciOlt7ImZuIjoiNm1nandscDdrZ2RiMi1TVERWVExQVCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.QnWnH6TZF5u4G9qoZJ-d7V9cDNPtR9dXeI2JNzO3oYY/image;s=1440x0;q=80"
            alt="carro"
          />
          <p className="font-bold mt-1 mb-2 px-2">Mercedes-Benz GLE 350</p>

          <div className="flex flex-col px-2">
              <span className="text-zinc-700 mb-6">2016/2016 | 23.000km </span>
              <strong className="text-black font-medium text-xl">15.000€</strong>
          </div>

          <div className="w-full h-px bg-slate-200 my-2">

          </div>

          <div  className="px-2 pb-2">
            <span className="text-black">
              Lisboa - Alverca do Ribatejo
            </span>
          </div>

        </section>

        

      </main>
    </Container>
  )
}

