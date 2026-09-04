import type { SVGProps } from 'react'
import type { AvatarId } from '../types'

interface AvatarProps extends SVGProps<SVGSVGElement> {
  size?: number
}

/** Hand-drawn doodle style little girl, ~7-8 years old: pigtails with bows, dress. */
export function AvatarGirl({ size = 64, ...rest }: AvatarProps) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} {...rest}>
      <ellipse cx="100" cy="188" rx="46" ry="7" fill="#3A2E4D" opacity="0.08" />
      {/* pigtails */}
      <path d="M52 78c-22-6-34 10-28 26 5 13 22 15 30 4" fill="#7C4633" stroke="#3A2E4D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M148 78c22-6 34 10 28 26-5 13-22 15-30 4" fill="#7C4633" stroke="#3A2E4D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="34" cy="100" r="9" fill="#FF5DA2" stroke="#3A2E4D" strokeWidth="3" />
      <circle cx="166" cy="100" r="9" fill="#FF5DA2" stroke="#3A2E4D" strokeWidth="3" />
      {/* legs */}
      <path d="M84 158l-6 30" stroke="#3A2E4D" strokeWidth="6" strokeLinecap="round" />
      <path d="M116 158l6 30" stroke="#3A2E4D" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="76" cy="190" rx="12" ry="6" fill="#FF9F45" stroke="#3A2E4D" strokeWidth="3" />
      <ellipse cx="124" cy="190" rx="12" ry="6" fill="#FF9F45" stroke="#3A2E4D" strokeWidth="3" />
      {/* dress */}
      <path d="M70 108c-6 30-14 44-16 52 30 14 62 14 92 0-2-8-10-22-16-52z" fill="#FFD93D" stroke="#3A2E4D" strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M78 118c8 6 36 6 44 0" stroke="#3A2E4D" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* arms */}
      <path d="M70 118c-14 8-20 20-18 32" stroke="#F6C7A6" strokeWidth="10" strokeLinecap="round" />
      <path d="M130 118c14 8 20 20 18 32" stroke="#F6C7A6" strokeWidth="10" strokeLinecap="round" />
      {/* head */}
      <circle cx="100" cy="82" r="40" fill="#F6C7A6" stroke="#3A2E4D" strokeWidth="4.5" />
      <path d="M62 70c4-24 26-38 38-38s34 14 38 38c-10-8-18-4-38-4s-28-4-38 4z" fill="#7C4633" stroke="#3A2E4D" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="84" cy="86" r="4.5" fill="#3A2E4D" />
      <circle cx="116" cy="86" r="4.5" fill="#3A2E4D" />
      <circle cx="76" cy="96" r="6" fill="#FF9F9F" opacity="0.7" />
      <circle cx="124" cy="96" r="6" fill="#FF9F9F" opacity="0.7" />
      <path d="M86 104c6 8 22 8 28 0" stroke="#3A2E4D" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/** Hand-drawn doodle style little boy, ~8-9 years old: spiky hair, t-shirt + shorts. */
export function AvatarBoy({ size = 64, ...rest }: AvatarProps) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} {...rest}>
      <ellipse cx="100" cy="188" rx="46" ry="7" fill="#3A2E4D" opacity="0.08" />
      {/* legs + shoes */}
      <path d="M86 158l-4 26" stroke="#3DB2FF" strokeWidth="14" strokeLinecap="round" />
      <path d="M114 158l4 26" stroke="#3DB2FF" strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="80" cy="188" rx="13" ry="7" fill="#3A2E4D" />
      <ellipse cx="120" cy="188" rx="13" ry="7" fill="#3A2E4D" />
      {/* shorts */}
      <path d="M72 130c-2 14 2 24 6 30h44c4-6 8-16 6-30z" fill="#3A2E4D" />
      {/* shirt */}
      <path d="M68 108c-4 8-6 16-4 26 12 8 60 8 72 0 2-10 0-18-4-26-8 8-56 8-64 0z" fill="#3DDC97" stroke="#3A2E4D" strokeWidth="4.5" strokeLinejoin="round" />
      {/* arms */}
      <path d="M68 112c-16 6-24 18-24 30" stroke="#F6C7A6" strokeWidth="10" strokeLinecap="round" />
      <path d="M132 112c16 6 24 18 24 30" stroke="#F6C7A6" strokeWidth="10" strokeLinecap="round" />
      {/* head */}
      <circle cx="100" cy="80" r="40" fill="#F6C7A6" stroke="#3A2E4D" strokeWidth="4.5" />
      <path d="M62 76c-6-20 8-42 38-42s44 22 38 42c-4-10-10-16-16-10-6-8-14-12-22-12s-16 4-22 12c-6-6-12 0-16 10z" fill="#3A2E4D" />
      <path d="M70 62l6-14M92 56l4-16M108 56l-4-16M130 62l-6-14" stroke="#3A2E4D" strokeWidth="5" strokeLinecap="round" />
      <circle cx="84" cy="86" r="4.5" fill="#3A2E4D" />
      <circle cx="116" cy="86" r="4.5" fill="#3A2E4D" />
      <circle cx="76" cy="96" r="6" fill="#FF9F9F" opacity="0.7" />
      <circle cx="124" cy="96" r="6" fill="#FF9F9F" opacity="0.7" />
      <path d="M84 106c6 6 26 6 32-2" stroke="#3A2E4D" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/** Hand-drawn doodle style teen, ~14-15 years old: taller, hoodie, side cap. */
export function AvatarTeen({ size = 64, ...rest }: AvatarProps) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} {...rest}>
      <ellipse cx="100" cy="192" rx="48" ry="6" fill="#3A2E4D" opacity="0.08" />
      {/* legs (jeans) */}
      <path d="M84 140l-8 46" stroke="#3D5AFE" strokeWidth="16" strokeLinecap="round" />
      <path d="M116 140l8 46" stroke="#3D5AFE" strokeWidth="16" strokeLinecap="round" />
      <ellipse cx="74" cy="190" rx="14" ry="7" fill="#3A2E4D" />
      <ellipse cx="126" cy="190" rx="14" ry="7" fill="#3A2E4D" />
      {/* hoodie body */}
      <path d="M62 100c-6 14-8 28-4 42 14 10 68 10 84 0 4-14 2-28-4-42-10 10-66 10-76 0z" fill="#7C4DFF" stroke="#3A2E4D" strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M92 108c2 6 14 6 16 0" stroke="#3A2E4D" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* arms crossed-ish / at sides */}
      <path d="M62 106c-16 8-22 22-20 36" stroke="#5A3FD6" strokeWidth="12" strokeLinecap="round" />
      <path d="M138 106c16 8 22 22 20 36" stroke="#5A3FD6" strokeWidth="12" strokeLinecap="round" />
      {/* head */}
      <circle cx="100" cy="76" r="38" fill="#E8B08A" stroke="#3A2E4D" strokeWidth="4.5" />
      {/* hair */}
      <path d="M64 70c-4-22 14-38 36-38s40 16 36 38c-6-10-16-4-20-14-6 8-46 8-52 0-4 10-14 4-20 14z" fill="#2E2136" stroke="#3A2E4D" strokeWidth="3.5" strokeLinejoin="round" />
      {/* sideways cap */}
      <path d="M56 58c8-16 30-24 48-18 14 5 22 16 24 26-20-10-52-10-72-8z" fill="#FF5DA2" stroke="#3A2E4D" strokeWidth="4" strokeLinejoin="round" />
      <path d="M120 62c10-2 20 0 26 6-8 4-18 4-24 0z" fill="#FF5DA2" stroke="#3A2E4D" strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="84" cy="82" r="4.5" fill="#3A2E4D" />
      <circle cx="116" cy="82" r="4.5" fill="#3A2E4D" />
      <circle cx="76" cy="92" r="5.5" fill="#FF9F9F" opacity="0.6" />
      <circle cx="124" cy="92" r="5.5" fill="#FF9F9F" opacity="0.6" />
      <path d="M86 100c6 5 22 5 28-1" stroke="#3A2E4D" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export const AVATARS: { id: AvatarId; label: string; Component: (p: AvatarProps) => React.JSX.Element }[] = [
  { id: 'girl', label: 'Lány (7-8 é.)', Component: AvatarGirl },
  { id: 'boy', label: 'Fiú (8-9 é.)', Component: AvatarBoy },
  { id: 'teen', label: 'Nagyobb (14-15 é.)', Component: AvatarTeen },
]

export function Avatar({ id, size = 64, ...rest }: AvatarProps & { id: AvatarId }) {
  const found = AVATARS.find((a) => a.id === id) ?? AVATARS[0]
  const Comp = found.Component
  return <Comp size={size} {...rest} />
}
