import type {
  Axis,
  SpringOptions,
  TweenOptions,
  AnimationType,
} from '@rubber/dom'

type AsTag =
  | 'a'
  | 'button'
  | 'div'
  | 'form'
  | 'h2'
  | 'h3'
  | 'label'
  | 'li'
  | 'nav'
  | 'ol'
  | 'p'
  | 'span'
  | 'ul'
  | ({} & string) // any other string

/**
 * Props for the VueRubber component.
 * Uses base types from @rubber/dom.
 */
interface VueRubberProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: AsTag
  /**
   * Whether the rubber effect is enabled.
   * @defaultValue true
   */
  enabled?: boolean
  /**
   * The axis along which the rubber effect is applied.
   * @defaultValue 'x'
   */
  axis?: Axis
  /**
   * Maximum stretch distance in pixels.
   * @defaultValue 150
   */
  maxStretch?: number
  /**
   * Resistance factor that affects how hard it is to stretch the element.
   * @defaultValue 0.5
   */
  resistance?: number
  /**
   * Intensity of the rubber effect.
   * @defaultValue 1
   */
  intensity?: number
  /**
   * Animation type for the rubber effect.
   * @defaultValue 'spring'
   */
  type?: AnimationType
  /**
   * Spring animation configuration.
   */
  spring?: SpringOptions
  /**
   * Tween animation configuration.
   */
  tween?: TweenOptions
}

type VueRubberProviderProps = Omit<VueRubberProps, 'as'>

export type { Axis, SpringOptions, TweenOptions, AnimationType }

export type { AsTag, VueRubberProps, VueRubberProviderProps }
