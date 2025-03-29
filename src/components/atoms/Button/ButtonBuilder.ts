import { ButtonHTMLAttributes, ReactNode } from 'react';
import { ButtonProps, ButtonSize, ButtonVariant } from './Button.types';

// Interfaz para las props del botón
export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  neumorph?: boolean;
  children?: ReactNode;
  fullWidth?: boolean;
  testId?: string;
}

/**
 * Implementación del patrón Builder para crear botones
 * Permite una configuración fluida y escalable de botones
 */
export class ButtonBuilder {
  private props: Partial<ButtonProps> = {};

  /**
   * Establece la variante del botón
   */
  setVariant(variant: ButtonVariant): ButtonBuilder {
    this.props.variant = variant;
    return this;
  }

  /**
   * Establece el tamaño del botón
   */
  setSize(size: ButtonSize): ButtonBuilder {
    this.props.size = size;
    return this;
  }

  /**
   * Establece si el botón está cargando
   */
  setIsLoading(isLoading: boolean): ButtonBuilder {
    this.props.isLoading = isLoading;
    return this;
  }

  /**
   * Establece si el botón está deshabilitado
   */
  setDisabled(disabled: boolean): ButtonBuilder {
    this.props.disabled = disabled;
    return this;
  }

  /**
   * Establece si el botón ocupa todo el ancho disponible
   */
  setFullWidth(fullWidth: boolean): ButtonBuilder {
    this.props.fullWidth = fullWidth;
    return this;
  }

  /**
   * Añade un icono a la izquierda del texto
   */
  setLeftIcon(icon: ReactNode): ButtonBuilder {
    this.props.leftIcon = icon;
    return this;
  }

  /**
   * Añade un icono a la derecha del texto
   */
  setRightIcon(icon: ReactNode): ButtonBuilder {
    this.props.rightIcon = icon;
    return this;
  }

  /**
   * Establece el contenido del botón
   */
  setChildren(children: ReactNode): ButtonBuilder {
    this.props.children = children;
    return this;
  }

  /**
   * Añade clases personalizadas
   */
  setClassName(className: string): ButtonBuilder {
    this.props.className = className;
    return this;
  }

  /**
   * Establece el testId para testing
   */
  setTestId(testId: string): ButtonBuilder {
    this.props.testId = testId;
    return this;
  }

  /**
   * Establece el manejador de eventos onClick
   */
  setOnClick(onClick: ButtonHTMLAttributes<HTMLButtonElement>['onClick']): ButtonBuilder {
    this.props.onClick = onClick;
    return this;
  }

  /**
   * Habilita el estilo neumórfico
   */
  setNeumorph(neumorph: boolean): ButtonBuilder {
    this.props.neumorph = neumorph;
    return this;
  }

  mergeProps(props: Partial<ButtonProps>): ButtonBuilder {
    this.props = { ...this.props, ...props };
    return this;
  }

  /**
   * Construye el objeto final de props
   */
  build(): Partial<ButtonProps> {
    return this.props;
  }
}