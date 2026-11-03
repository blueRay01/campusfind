import { Link } from "react-router-dom"

// Each category always gets the same tint, so the feed has a bit of rhythm
const IMAGE_TINTS = ["bg-lime-soft", "bg-violet-soft", "bg-surface-container"]
const BADGE_COLORS = ["bg-lime", "bg-violet", "bg-surface-container-lowest"]

function toneFor(text = "") {
  let hash = 0
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return hash % IMAGE_TINTS.length
}

function ItemCard({ id, title, location, image, category }) {
  const tone = toneFor(category)

  return (
    <Link to={`/item/${id}`} className="group block rounded-[22px] focus-visible:outline-none">
      <div
        className={`relative aspect-[4/3] overflow-hidden rounded-[20px] border-2 border-ink ${IMAGE_TINTS[tone]} transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-pop group-focus-visible:-translate-y-1 group-focus-visible:shadow-pop`}
      >
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full place-items-center">
            <span className="material-symbols-outlined text-[48px] text-ink/40">image</span>
          </div>
        )}

        {category && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full border-2 border-ink font-label-caps text-label-caps uppercase ${BADGE_COLORS[tone]}`}>
            {category}
          </span>
        )}
      </div>

      <h3 className="mt-md font-headline-md text-headline-md text-ink line-clamp-1">
        {title}
      </h3>

      <p className="mt-xs flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px] shrink-0">location_on</span>
        <span className="line-clamp-1">{location}</span>
      </p>
    </Link>
  )
}

export default ItemCard
