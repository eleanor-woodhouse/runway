export function getOffsetWidth(ref: React.MutableRefObject<HTMLDivElement | null>) {
  return ref && ref.current ? ref.current.offsetWidth : 0
}

export function getOffsetHeight(ref: React.MutableRefObject<HTMLDivElement | null>) {
  return ref && ref.current ? ref.current.offsetHeight : 0
}
