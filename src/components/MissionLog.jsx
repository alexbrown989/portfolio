import { useEffect, useState } from 'react'


export default function MissionLog({ sections = [] }) {
const [active, setActive] = useState(null)


useEffect(() => {
const obs = new IntersectionObserver((entries) => {
entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
}, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 })


sections.forEach(s => {
const el = document.getElementById(s.id)
if (el) obs.observe(el)
})
return () => obs.disconnect()
}, [sections])


const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })


return (
<aside className="hidden xl:block sticky top-24 float-right w-72 mr-[-19rem] z-10">
<div className="glass rounded-2xl p-4">
<p className="text-primary/80 text-xs">[ MISSION LOG ]</p>
<ul className="mt-3 space-y-1 text-sm">
{sections.map(s => (
<li key={s.id}>
<button onClick={() => go(s.id)} className={`w-full text-left hover:text-primary transition ${active === s.id ? 'text-primary' : 'text-gray-300'}`}>
▸ {s.label}
</button>
</li>
))}
</ul>
</div>
</aside>
)
}