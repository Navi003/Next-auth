import AuthForm from "@/components/auth-form";

//added automaticaly on Page components
export default async function Home({ searchParams }) {
  const formMode = searchParams.mode || "login";

  return <AuthForm mode={formMode} />;
}
