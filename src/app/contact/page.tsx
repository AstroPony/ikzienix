'use client'

export default function ContactPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <h1 className="display-4 text-center mb-5">Get in Touch</h1>

          <div className="row g-4">
            {/* Contact Information */}
            <div className="col-md-6">
              <div className="mb-4">
                <h2 className="h3 mb-4">Contact Information</h2>
                
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light rounded-circle p-3 me-3">
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <div>
                    <h3 className="h6 mb-1">Phone</h3>
                    <p className="text-muted mb-0">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light rounded-circle p-3 me-3">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div>
                    <h3 className="h6 mb-1">Email</h3>
                    <p className="text-muted mb-0">support@ikzienix.com</p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div className="bg-light rounded-circle p-3 me-3">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div>
                    <h3 className="h6 mb-1">Address</h3>
                    <p className="text-muted mb-0">123 Festival Street<br />Amsterdam, Netherlands</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="h5 mb-3">Follow Us</h3>
                <div className="d-flex gap-3">
                  <a href="#" className="text-muted">
                    <i className="bi bi-instagram fs-4"></i>
                    <span className="visually-hidden">Instagram</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-md-6">
              <h2 className="h3 mb-4">Send us a Message</h2>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 