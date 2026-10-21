import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function WebsiteShowcase({ websites }) {
 if (!websites.length) return null;
 return <section id="websites" className="website-showcase section" tabIndex="-1" aria-labelledby="websites-title">
  <div className="section-top"><span className="mono section-index">WEBSITE DESIGN & DEVELOPMENT</span><a className="website-enquiry mono" href="mailto:pedrosajester28@gmail.com?subject=Website%20project%20enquiry">Have a website in mind? <ArrowUpRight size={16}/></a></div>
  <h2 id="websites-title" className="section-heading">WEBSITES<br/>I’VE CREATED.</h2>
  <div className="website-list">{websites.map(site=><article key={site.id} className="website-entry">
   {site.image&&<a className="website-image" href={site.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${site.name} (opens in a new tab)`}><img src={site.image} loading="lazy" alt={site.imageAlt||`${site.name} website preview`}/></a>}
   <div className="website-info"><div><h3>{site.name}</h3>{site.role&&<p className="mono website-role">{site.role}</p>}</div>{site.description&&<p className="website-description">{site.description}</p>}
   {site.tags?.length>0&&<ul className="website-tags mono" aria-label="Technologies">{site.tags.map(tag=><li key={tag}>{tag}</li>)}</ul>}
   {site.url&&<a className="website-visit" href={site.url} target="_blank" rel="noopener noreferrer">Visit website <ArrowUpRight size={18}/><span className="sr-only">: {site.name} (opens in a new tab)</span></a>}</div>
  </article>)}</div>
 </section>;
}
