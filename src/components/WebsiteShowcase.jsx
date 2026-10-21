import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function WebsiteShowcase({ websites }) {
 if (!websites.length) return null;
 return <section id="websites" className="website-showcase section" tabIndex="-1" aria-labelledby="websites-title">
  <div className="section-top"><span className="mono section-index">WEBSITE DESIGN & DEVELOPMENT</span><a className="website-enquiry mono" href="mailto:pedrosajester28@gmail.com?subject=Website%20project%20enquiry">Have a website in mind? <ArrowUpRight size={16}/></a></div>
  <h2 id="websites-title" className="section-heading">WEBSITES<br/>I’VE CREATED.</h2>
  <div className="website-table-wrap" role="region" aria-label="Website projects table" tabIndex="0">
   <table className="website-table">
    <caption className="sr-only">Websites created by Jester Pedrosa. View project details or open each live website in a new tab.</caption>
    <thead><tr><th scope="col">Preview</th><th scope="col">Website</th><th scope="col">Type</th><th scope="col">Live site</th></tr></thead>
    <tbody>{websites.map(site=><tr key={site.id}>
     <td>{site.image&&<a className="website-table-preview" href={site.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${site.name} (opens in a new tab)`}><img src={site.image} loading="lazy" width="1440" height="1000" alt={site.imageAlt||`${site.name} website preview`}/></a>}</td>
     <th scope="row"><h3>{site.name}</h3><details className="website-table-details"><summary>Project details<span className="sr-only"> for {site.name}</span></summary>{site.description&&<p>{site.description}</p>}{site.tags?.length>0&&<ul aria-label="Website features">{site.tags.map(tag=><li key={tag}>{tag}</li>)}</ul>}</details></th>
     <td className="website-table-type">{site.role?.split(' · ').slice(1).join(' · ')||site.role}</td>
     <td>{site.url&&<a className="website-visit" href={site.url} target="_blank" rel="noopener noreferrer">Visit <ArrowUpRight size={18}/><span className="sr-only"> {site.name} (opens in a new tab)</span></a>}</td>
    </tr>)}</tbody>
   </table>
  </div>
  <p className="website-table-note">Concept websites and portfolio demos. Explore the live sites or expand a project for details.</p>
 </section>;
}
