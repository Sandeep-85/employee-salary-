import SalaryForm from "@/components/SalaryForm";

export default function Home() {
  return (
    <div className="min-h-screen w-full px-4 py-16 sm:px-8">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h1 className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">
          Employee Salary Prediction
        </h1>
        <p className="mt-3 text-foreground/70">
          Predict salary ranges by role, experience, location, education, and skills.
        </p>
      </div>

      <SalaryForm />
    </div>
  );
}
