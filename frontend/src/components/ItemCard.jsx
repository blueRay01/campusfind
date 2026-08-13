import { useNavigate, Link } from "react-router-dom"

function ItemCard({ id, title, location, image, category }) {
  const navigate = useNavigate()

  const badgeStyle = category === "LOST"
    ? "bg-error text-white"
    : "bg-on-surface text-white"

  return (
    <Link to={`/item/${id}`} className="bg-background cute-card-shadow transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)] duration-300">

      <div className="relative mb-md h-80 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full font-label-caps text-label-caps ${badgeStyle}`}>
          {category}
        </span>
      </div>

      <h3 className="font-headline-md text-headline-md text-primary mb-xs uppercase">
        {title}
      </h3>

      <div className="flex items-center gap-2 text-on-surface-variant mb-md">
        <span className="material-symbols-outlined text-sm">location_on</span>
        <span className="font-body-sm text-secondary">{location}</span>
      </div>

    </Link>
  )
}

export default ItemCard