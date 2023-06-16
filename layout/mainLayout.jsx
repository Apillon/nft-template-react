import Header from "../components/header";

export default function MainLayout({ children }) {
  return (
    <div className="container">
      <Header />
      {children}
    </div>
  );
}
