'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface Coordinate {
  lat: number
  lng: number
}

interface ListingMarker {
  id: string
  title: string
  price: number
  type: string
  coordinates: Coordinate
  coverImage: string
}

interface ListingMapProps {
  center?: Coordinate
  zoom?: number
  markers?: ListingMarker[]
  onMarkerClick?: (listingId: string) => void
  className?: string
}

// Custom price icon
const createPriceIcon = (price: number) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">${price}€</div>`,
    iconSize: [60, 24],
    iconAnchor: [30, 12],
  })
}

function MapBounds({ markers }: { markers: Coordinate[] }) {
  const map = useMap()

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [markers, map])

  return null
}

export function ListingMap({
  center,
  zoom = 14,
  markers = [],
  onMarkerClick,
  className = '',
}: ListingMapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-500">Cargando mapa...</div>
      </div>
    )
  }

  // Default center: Madrid
  const mapCenter: [number, number] = center ? [center.lat, center.lng] : [40.4168, -3.7038]

  const markerCoordinates = markers.map(m => m.coordinates)

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      className={className}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.coordinates.lat, marker.coordinates.lng]}
          icon={createPriceIcon(marker.price)}
          eventHandlers={{
            click: () => onMarkerClick?.(marker.id),
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <img
                src={marker.coverImage}
                alt={marker.title}
                className="w-full h-24 object-cover rounded mb-2"
              />
              <h3 className="font-semibold text-sm line-clamp-1">{marker.title}</h3>
              <p className="text-blue-600 font-bold">{marker.price}€/mes</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {markers.length > 1 && (
        <MapBounds markers={markerCoordinates} />
      )}
    </MapContainer>
  )
}
