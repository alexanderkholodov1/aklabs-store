import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  title?: string
}

const ImageGallery = ({ images, title = "Producto AKLabs" }: ImageGalleryProps) => {
  const visible = images.filter((image) => !!image.url)

  if (!visible.length) {
    return (
      <div className="glass flex aspect-square w-full items-center justify-center rounded-[32px] text-ak-ink/40">
        Sin imagen
      </div>
    )
  }

  const [first, ...rest] = visible

  return (
    <div className="flex flex-col gap-4">
      <div
        className="glass liquid rim-ak rounded-[36px] p-3"
        id={first.id}
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-[28px] bg-white">
          <Image
            src={first.url!}
            priority
            className="object-cover"
            alt={`${title}, imagen 1`}
            fill
            sizes="(max-width: 1024px) 100vw, 720px"
          />
        </div>
      </div>
      {rest.length > 0 && (
        <div
          className={clx(
            "grid gap-4",
            rest.length === 1 ? "grid-cols-1" : "grid-cols-2"
          )}
        >
          {rest.map((image, index) => (
            <div key={image.id} className="glass rounded-[28px] p-2.5" id={image.id}>
              <div className="relative aspect-square w-full overflow-hidden rounded-[22px] bg-white">
                <Image
                  src={image.url!}
                  className="object-cover"
                  alt={`${title}, imagen ${index + 2}`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 360px"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
