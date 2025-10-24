export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-700 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm opacity-90">
          &copy; {new Date().getFullYear()} SmartOlive AI - Empowering Tunisian Olive Farmers with AI
        </p>
        <p className="text-xs opacity-75 mt-2">
          Smart Agriculture • Sustainable Future
        </p>
      </div>
    </footer>
  );
}
