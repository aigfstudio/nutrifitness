import { Metadata } from 'next'
import { Package, Lock, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Politique de Retour | NutriFitness.ch',
  description: 'Informations sur les retours faciles sous 14 jours pour vos compléments alimentaires chez NutriFitness.ch.',
}

export default function ReturnsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#111] text-white py-14 px-4 text-center">
        <h1 className="font-display text-5xl font-black tracking-wide">POLITIQUE DE <span className="text-[#c8102e]">RETOUR</span></h1>
        <p className="text-gray-400 mt-2">Votre satisfaction est notre priorité absolue.</p>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-12 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: <Package size={36} strokeWidth={1.5} />, title: '14 Jours', sub: 'Délai de retour dès réception' },
            { icon: <Lock size={36} strokeWidth={1.5} />, title: 'Non Ouvert', sub: 'Produit scellé et en bon état' },
            { icon: <Mail size={36} strokeWidth={1.5} />, title: 'Contact Préalable', sub: 'Contactez-nous avant le renvoi' },
          ].map(item => (
            <div key={item.title} className="text-center border border-gray-100 p-6 rounded-sm bg-gray-50/20">
              <div className="flex justify-center mb-3 text-[#c8102e]">{item.icon}</div>
              <div className="font-black text-dark text-xl">{item.title}</div>
              <div className="text-xs text-gray-500 mt-1">{item.sub}</div>
            </div>
          ))}
        </div>

        {[
          {
            title: 'Conditions d’Éligibilité',
            body: 'Vous disposez d’un délai de 14 jours à compter de la réception de votre colis pour nous retourner un produit. Les articles doivent être retournés non ouverts, scellés, inutilisés et dans leur emballage d’origine en parfait état. Pour des raisons d’hygiène et de sécurité, nous ne pouvons accepter le retour de compléments alimentaires entamés ou ouverts.'
          },
          {
            title: 'Procédure de Retour',
            body: '1. Contactez obligatoirement notre équipe par email à info@nutrifitness.ch en indiquant votre numéro de commande.\n2. Préparez votre colis soigneusement avec le produit bien protégé.\n3. Renvoyez le colis à l’adresse de notre boutique :\n   NutriFitness\n   Rue des Pâquis 34\n   1201 Genève, Suisse.'
          },
          {
            title: 'Frais de Retour',
            body: 'Les frais de retour sont à la charge exclusive du client, sauf s’il s’agit d’une erreur de notre part lors de la préparation de la commande ou d’un produit avéré défectueux. Dans ce cas, nous prendrons en charge le bon d’expédition.'
          },
          {
            title: 'Remboursements',
            body: 'Une fois le retour réceptionné et validé par notre équipe, nous procéderons au remboursement sur le mode de paiement d’origine. Le traitement prend généralement entre 5 à 7 jours ouvrables après réception du colis.'
          },
        ].map(section => (
          <div key={section.title} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
            <h2 className="font-display text-xl text-dark font-black mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#c8102e] rounded-full flex items-center justify-center text-white text-[10px]">→</span>
              {section.title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{section.body}</p>
          </div>
        ))}

        <div className="bg-[#c8102e] text-white p-8 rounded-sm text-center">
          <div className="font-bold text-lg mb-1">Une question sur un retour ?</div>
          <div className="text-sm text-red-100 mb-4">Contactez notre support et nous vous répondrons sous 24h.</div>
          <a href="mailto:info@nutrifitness.ch" className="bg-white text-[#c8102e] font-black px-6 py-2.5 text-sm inline-block hover:bg-gray-100 transition-colors uppercase rounded-sm">
            NOUS ÉCRIRE →
          </a>
        </div>
      </div>
    </div>
  )
}
