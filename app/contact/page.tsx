import { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contactez-nous | NutriFitness.ch',
  description: 'Une question sur un produit, besoin de conseils personnalisés ou un suivi de commande ? L\'équipe NutriFitness à Genève est à votre écoute.',
}

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#111] text-white py-14 px-4 text-center">
        <h1 className="font-display text-5xl font-black tracking-wide">CONTACTEZ-<span className="text-[#c8102e]">NOUS</span></h1>
        <p className="text-gray-400 mt-2">Une question, besoin de conseils personnalisés ? L’équipe NutriFitness est à votre écoute !</p>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Info Column */}
        <div className="space-y-8">
          <div>
            <div className="text-xs font-black tracking-widest text-[#c8102e] uppercase mb-4">Nos Coordonnées</div>
            <div className="space-y-5">
              {[
                { icon: <MapPin size={24} />, label: 'Notre boutique physique', value: '34 Rue des Pâquis, 1201 Genève, Suisse' },
                { icon: <Phone size={24} />, label: 'Par téléphone', value: '+41 79 250 35 64', sub: 'Durant les horaires d’ouverture.' },
                { icon: <Mail size={24} />, label: 'Par email', value: 'info@nutrifitness.ch', sub: 'Nous répondons sous 24 à 48h.' },
                {
                  icon: <Clock size={24} />,
                  label: 'Horaires d’ouverture',
                  value: 'Lundi – Vendredi : 10h – 18h',
                  sub: 'Samedi : 10h – 17h | Dimanche : Fermé'
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <span className="mt-1 text-[#c8102e]">{item.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">{item.label}</div>
                    <div className="text-sm font-bold text-dark">{item.value}</div>
                    {item.sub && <div className="text-xs text-gray-500 mt-0.5">{item.sub}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div>
            <div className="text-xs font-black tracking-widest text-[#c8102e] uppercase mb-3">Suivez-nous sur les réseaux</div>
            <p className="text-xs text-gray-500 mb-3">Retrouvez nos conseils, nouveautés et promos sur :</p>
            <div className="flex gap-3 flex-wrap">
              {[
                { name: 'Instagram', url: 'https://www.instagram.com/nutrifitness.ch/' },
                { name: 'Facebook', url: 'https://www.facebook.com/p/NutriFit-100069395283617/' },
                { name: 'WhatsApp', url: 'https://wa.me/41792503564?text=Je%20suis%20intéressé(e)%20à%20en%20savoir%20plus%20sur%20vos%20produits' }
              ].map(s => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-gray-200 text-xs font-bold text-gray-600 hover:border-[#c8102e] hover:text-[#c8102e] transition-colors rounded-sm"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Form Column */}
        <form className="space-y-4 bg-gray-50 p-6 sm:p-8 border border-gray-200 rounded-sm">
          <div className="text-xs font-black tracking-widest text-[#c8102e] uppercase mb-2">Formulaire de contact</div>
          <p className="text-xs text-gray-500 mb-4">Écrivez-nous directement via ce formulaire rapide :</p>
          {[
            { name: 'name', label: 'Nom Complet *', type: 'text', placeholder: 'Votre nom complet' },
            { name: 'email', label: 'Email *', type: 'email', placeholder: 'votre@email.ch' },
            { name: 'phone', label: 'Téléphone', type: 'tel', placeholder: 'Votre numéro (facultatif)' },
            { name: 'subject', label: 'Sujet *', type: 'text', placeholder: 'Comment pouvons-nous vous aider ?' },
          ].map(f => (
            <div key={f.name}>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                required={f.label.includes('*')}
                className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#c8102e] rounded-sm bg-white"
              />
            </div>
          ))}
          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Message *</label>
            <textarea
              rows={4}
              required
              placeholder="Votre message..."
              className="w-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#c8102e] rounded-sm resize-none bg-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#c8102e] text-white font-black tracking-widest py-3.5 text-sm hover:bg-[#a50d28] transition-colors uppercase rounded-sm"
          >
            ENVOYER LE MESSAGE
          </button>
        </form>
      </div>

      {/* Embedded Map placeholder */}
      <div className="h-80 bg-gray-100 flex items-center justify-center border-t border-gray-200">
        <div className="text-center p-4">
          <div className="text-3xl mb-2">🗺️</div>
          <div className="font-bold text-dark mb-1">Retrouvez-nous à Genève</div>
          <p className="text-xs text-gray-500">34 Rue des Pâquis, 1201 Genève</p>
          <a
            href="https://maps.google.com/?q=34+Rue+des+Pâquis,+1201+Genève"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#c8102e] underline mt-2 block"
          >
            Ouvrir dans Google Maps
          </a>
        </div>
      </div>
    </div>
  )
}
