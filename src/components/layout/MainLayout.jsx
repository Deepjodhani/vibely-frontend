import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
