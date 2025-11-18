import Link from "next/link"
import { Facebook, X, Instagram, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6">
          {/* Mission Statement */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Empowering our community through leadership and education
          </p>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-6">
            <Link
              href="https://www.facebook.com/futureleadersassemblybd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary transition-all duration-200 hover:scale-110"
            >
              <Facebook className="w-6 h-6" />
            </Link>
            <Link
              href="https://x.com/FLA_Bangladesh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary transition-all duration-200 hover:scale-110"
            >
              <X className="w-6 h-6" />
            </Link>
            <Link
              href="https://www.instagram.com/_flabd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary transition-all duration-200 hover:scale-110"
            >
              <Instagram className="w-6 h-6" />
            </Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <a href="mailto:contact@futureleadersassembly.org" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="w-4 h-4" />
              contact@futureleadersassembly.org
            </a>
            <a href="tel:01538382908" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />
              01538382908
            </a>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Future Leaders Assembly Bangladesh. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
