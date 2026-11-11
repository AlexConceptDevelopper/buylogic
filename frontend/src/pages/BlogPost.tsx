import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { articles } from "../data/articles";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const article = articles.find((a) => a.slug === slug);

  // Cas où l'article n'existe pas
  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <Helmet>
          <title>Article introuvable | BuyLogic</title>
        </Helmet>
        <h1 className="text-2xl font-bold mb-4">
          Oups, cet article n'existe pas.
        </h1>
        <Link to="/blog" className="text-cyan-400 hover:underline">
          &larr; Retourner au blog
        </Link>
      </div>
    );
  }

  // URL absolue dynamique de l'article en cours pour le partage
  const currentUrl = `https://buylogic.fr/blog/${article.slug}`;
  const encodedTitle = encodeURIComponent(article.title);
  const encodedUrl = encodeURIComponent(currentUrl);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-400 selection:text-slate-950">
      <Helmet>
        <title>{article.title} | Blog BuyLogic</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={currentUrl} />

        {/* Données structurées JSON-LD pour Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.title,
            description: article.description,
            datePublished: article.date,
            author: {
              "@type": "Organization",
              name: "BuyLogic",
            },
            publisher: {
              "@type": "Organization",
              name: "BuyLogic",
              logo: {
                "@type": "ImageObject",
                url: "https://buylogic.fr/logo.png",
              },
            },
          })}
        </script>
      </Helmet>

      <Navbar />

      <main className="grow py-16 px-6">
        <article className="mx-auto max-w-6xl">
          {/* Bouton de retour */}
          <Link
            to="/blog"
            className="text-sm font-semibold text-cyan-400 hover:underline mb-8 inline-flex items-center gap-2"
          >
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

          {/* Corps de l'article */}
          <div
            className="prose prose-invert max-w-none text-slate-300 space-y-6 leading-relaxed pt-6 border-t border-white/10 text-lg sm:text-xl"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Barre de partage social dynamique en BAS de page */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-white/10 text-sm">
            <span className="text-slate-300 font-semibold text-base">
              Vous avez aimé cet article ? Partagez-le :
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium"
              >
                LinkedIn
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium"
              >
                X (Twitter)
            </a>
              <a
                href={`mailto:?subject=${encodedTitle}&body=Découvre cet article intéressant : ${currentUrl}`}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium"
              >
                E-mail
              </a>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}