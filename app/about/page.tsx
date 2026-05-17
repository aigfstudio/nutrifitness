import { Metadata } from 'next'
import { Microscope, Star, Handshake, MapPin, Truck } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'À Propos | NutriFitness.ch',
  description: 'Découvrez l\'histoire de NutriFitness.ch — Compléments alimentaires premium et nutrition sportive à Genève et partout en Suisse depuis 2015.',
}

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-[#111] text-white py-20 px-4">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="text-xs font-black tracking-[4px] text-[#c8102e] uppercase mb-4">Notre Histoire</div>
          <h1 className="font-display text-5xl sm:text-6xl font-black tracking-wide mb-4">
            À PROPOS DE <span className="text-[#c8102e]">NUTRIFITNESS</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Votre boutique de confiance pour des compléments alimentaires premium et un accompagnement personnalisé en Suisse.
          </p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-16 space-y-16">
        {/* Intro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-black tracking-[3px] text-[#c8102e] uppercase mb-3">Passion & Mission</div>
            <h2 className="font-display text-4xl text-dark mb-4">Une passion devenue mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Fondée en <strong>2015 à Genève par Marco</strong>, passionné de fitness et de bien-être, NutriFitness est née du désir d’offrir aux passionnés de musculation et de remise en forme des produits de qualité et des conseils avisés pour atteindre leur plein potentiel.
            </p>
            <p className="text-gray-600 leading-relaxed">
              D’abord une boutique physique, NutriFitness est rapidement devenue une référence en Suisse, réunissant une communauté fidèle autour de valeurs fortes : performance, santé, et dépassement de soi.
            </p>
          </div>
          <div className="bg-gray-50 p-8 flex flex-col items-center justify-center rounded-sm border border-gray-100 text-center">
            <span className="text-6xl font-black text-[#c8102e] leading-none font-display">NF</span>
            <span className="text-xs font-bold text-gray-400 tracking-[4px] uppercase mt-3">Depuis 2015 à Genève</span>
            <div className="w-12 h-0.5 bg-[#c8102e] my-4" />
            <p className="text-xs text-gray-500 max-w-[200px]">Plus de 9 ans d'expertise à votre service</p>
          </div>
        </div>

        {/* Commitment */}
        <div>
          <div className="text-xs font-black tracking-[3px] text-[#c8102e] uppercase mb-3 text-center">Notre Engagement</div>
          <h2 className="font-display text-4xl text-dark text-center mb-8">La qualité avant tout</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto leading-relaxed mb-10">
            Depuis maintenant 9 ans, nous opérons dans l’univers des compléments alimentaires pour la musculation et le fitness, avec une exigence constante : la qualité avant tout. Nos produits sont soigneusement sélectionnés pour répondre aux besoins spécifiques de chaque profil — du débutant motivé à l’athlète confirmé.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Microscope size={28} />,
                title: 'Matières premières premium',
                desc: 'Des ingrédients naturels et purs pour des résultats optimaux et une sécurité totale.'
              },
              {
                icon: <Star size={28} />,
                title: 'Les mieux notés et évalués',
                desc: 'Des compléments hautement évalués et testés pour garantir leur qualité et efficacité.'
              },
              {
                icon: <Handshake size={28} />,
                title: 'La confiance des experts',
                desc: 'Fiabilité et excellence reconnues par les professionnels de la santé et du sport.'
              }
            ].map(v => (
              <div key={v.title} className="p-6 border border-gray-100 rounded-sm bg-gray-50/50">
                <div className="mb-3 text-dark">{v.icon}</div>
                <div className="font-bold text-dark mb-2 text-sm">{v.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Presence */}
        <div className="border-t border-b border-gray-100 py-10 my-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="text-[#c8102e]"><MapPin size={36} strokeWidth={1.5} /></div>
              <div>
                <h3 className="font-bold text-dark mb-1">Une présence locale à Genève</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Notre boutique physique située au <strong>34 Rue des Pâquis à Genève</strong> est à votre disposition pour vous conseiller et vous accompagner de manière personnalisée.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-[#c8102e]"><Truck size={36} strokeWidth={1.5} /></div>
              <div>
                <h3 className="font-bold text-dark mb-1">Une livraison rapide dans toute la Suisse</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Notre boutique en ligne est accessible 24/7 partout en Suisse, avec une expédition sous 24/48h et livraison gratuite dès CHF 75.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why choose us */}
        <div className="text-center space-y-4">
          <h2 className="font-display text-4xl text-dark">Pourquoi choisir NutriFitness ?</h2>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed text-sm">
            Parce que nous ne nous contentons pas de vendre des compléments. Nous mettons notre expérience, notre expertise et notre écoute au service de vos objectifs. Que vous cherchiez à gagner en muscle, à perdre du gras, à augmenter votre énergie, ou simplement à améliorer votre hygiène de vie, nous sommes là pour vous accompagner.
          </p>
          <div className="text-[#c8102e] font-display text-2xl font-bold uppercase tracking-wider pt-2">
            Ensemble, construisons votre meilleure forme.
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#c8102e] text-white p-10 text-center rounded-sm">
          <h2 className="font-display text-4xl font-black mb-2">PRÊT À ATTEINDRE VOS OBJECTIFS ?</h2>
          <p className="text-red-100 text-sm mb-6">Bénéficiez de 10% de remise sur votre première commande avec le code <strong className="underline">NF10</strong> !</p>
          <Link href="/products" className="bg-white text-[#c8102e] font-black px-8 py-3.5 text-sm tracking-widest hover:bg-gray-100 transition-colors inline-block uppercase">
            Voir tous les produits →
          </Link>
        </div>
      </div>
    </div>
  )
}
