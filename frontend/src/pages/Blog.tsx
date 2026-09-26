import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { articles } from "../data/articles";

export default function Blog() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-400 selection:text-slate-950">
      <Helmet>
        <title>Blog BuyLogic | Conseils et stratégies d'achats pour PME</title>
        <meta 
          name="description" 
          content="Retrouvez nos analyses, guides pratiques et retours d'expérience pour optimiser vos stocks, automatiser vos approvisionnements et piloter votre croissance en PME." 
        />
        <link rel="canonical" href="https://buylogic.fr/blog" />
      </Helmet>

      <Navbar />

      <main className="grow">
        {/* En-tête de la page Blog */}
        <section className="relative overflow-hidden py-20 px-6 border-b border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.15),rgba(255,255,255,0))] pointer-events-none" />
          
          <div className="mx-auto max-w-4xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Le Blog BuyLogic
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Conseils et actualités sur la <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">gestion des achats PME</span>
            </h1>

            <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
              Retrouvez nos analyses, guides pratiques et retours d'expérience pour optimiser vos stocks, automatiser vos approvisionnements et piloter votre croissance.
            </p>
          </div>
        </section>

        {/* Grille des articles dynamiques */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-7xl">
            {articles.length === 0 ? (
              <p className="text-center text-slate-500 py-12">Aucun article disponible pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <article 
                    key={article.slug}
                    className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-6 transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-900 hover:shadow-xl hover:shadow-cyan-500/5"
                  >
                    <div>
                      {/* Meta info : Catégorie & Temps de lecture */}
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                        <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 font-medium text-cyan-400">
                          {article.category}
                        </span>
                        <span>{article.readTime}</span>
                      </div>

                      {/* Titre */}
                      <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        <Link to={`/blog/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h2>

                      {/* Description */}
                      <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                        {article.description}
                      </p>
                    </div>

                    {/* Pied de carte : Date & Lien */}
                    <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                      <span>{article.date}</span>
                      <Link 
                        to={`/blog/${article.slug}`}
                        className="font-semibold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        Lire l'article 
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}