export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-top border-dark mt-auto py-4 px-3">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-6 text-secondary small mb-2 mb-md-0">
            © {year} ikzienix — part of the{' '}
            <span className="font-monospace">ik</span> universe
          </div>
          <div className="col-md-6 text-md-end">
            <span className="text-secondary small font-monospace">
              v0.1-beta · ik zie niks
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
