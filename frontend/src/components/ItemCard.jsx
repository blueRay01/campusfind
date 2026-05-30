import { useNavigate } from "react-router-dom"

function ItemCard({ id, title, location, image, category }) {
  const navigate = useNavigate()

  const badgeStyle = category === "LOST"
    ? "bg-error text-white"
    : "bg-primary-container text-white"

  return (
    <article className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 cute-card-shadow transition-transform hover:-translate-y-1 duration-300">

      <div className="relative mb-md h-48 rounded-lg overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full font-label-caps text-label-caps ${badgeStyle}`}>
          {category}
        </span>
      </div>

      <h3 className="font-headline-md text-headline-md text-primary mb-xs">
        {title}
      </h3>

      <div className="flex items-center gap-2 text-on-surface-variant mb-md">
        <span className="material-symbols-outlined text-sm">location_on</span>
        <span className="font-body-sm text-body-sm">{location}</span>
      </div>

      <button
        onClick={() => navigate(`/item/${id}`)}
        className="w-full bg-primary text-white py-2.5 rounded-full font-button text-button hover:bg-primary/90 transition-colors"
      >
        View Details
      </button>

    </article>
  )
}

export default ItemCard