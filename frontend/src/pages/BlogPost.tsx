import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { articles } from "../data/articles";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <Helmet>
          <title>Article introuvable | BuyLogic</title>
        </Helmet>
        <h1 className="text-2xl font-bold mb-4">Oups, cet article n'existe pas.</h1>
        <Link to="/blog" className="text-cyan-400 hover:underline">&larr; Retourner au blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-400 selection:text-slate-950">
      <Helmet>
        <title>{article.title} | Blog BuyLogic</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={`https://buylogic.fr/blog/${article.slug}`} />
      </Helmet>

      <Navbar />

      <main className="grow py-16 px-6">
        {/* On limite un peu la largeur pour un confort de lecture optimal (max-w-4xl ou 5xl au lieu de 7xl) */}
        <article className="mx-auto max-w-6xl">
          {/* Bouton de retour */}
          <Link to="/blog" className="text-sm font-semibold text-cyan-400 hover:underline mb-8 inline-flex items-center gap-2">
            <span>&larr;</span> Retour aux articles
          </Link>

          {/* En-tête de l'article */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-6">
            <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 font-medium text-cyan-400">
              {article.category}
            </span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl mb-8 leading-tight">
            {article.title}
          </h1>

          {/* Corps de l'article injecté avec un texte plus grand (text-lg sm:text-xl) */}
          <div 
            className="prose prose-invert max-w-none text-slate-300 space-y-6 leading-relaxed pt-6 border-t border-white/10 text-lg sm:text-xl"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}