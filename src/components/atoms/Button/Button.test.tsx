import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import { ButtonBuilder } from './ButtonBuilder';
import { isFeatureEnabled, FeatureFlags } from '@core/config/featureFlags';

vi.mock('../../../core/config/featureFlags', () => ({
  isFeatureEnabled: () => false,
  FeatureFlags: {
    USE_NEUMORPHISM: 'USE_NEUMORPHISM'
  }
}));

describe('Button Component', () => {
  it('renders correctly with primary variant', () => {
    const button = new ButtonBuilder()
      .withVariant('primary')
      .withSize('md')
      .withChildren('Test Button')
      .build();
      
    render(<Button {...button} />);
    
    const buttonElement = screen.getByText('Test Button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.classList.contains('bg-primary')).toBe(true);
  });
  
  it('renders correctly with secondary variant', () => {
    const button = new ButtonBuilder()
      .withVariant('secondary')
      .withSize('md')
      .withChildren('Secondary')
      .build();
      
    render(<Button {...button} />);
    
    const buttonElement = screen.getByText('Secondary');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.classList.contains('bg-secondary')).toBe(true);
  });
  
  it('renders with different sizes', () => {
    const smallButton = new ButtonBuilder()
      .withVariant('primary')
      .withSize('sm')
      .withChildren('Small')
      .build();
      
    const largeButton = new ButtonBuilder()
      .withVariant('primary')
      .withSize('lg')
      .withChildren('Large')
      .build();
      
    const { rerender } = render(<Button {...smallButton} />);
    expect(screen.getByText('Small').classList.contains('h-8')).toBe(true);
    
    rerender(<Button {...largeButton} />);
    expect(screen.getByText('Large').classList.contains('h-12')).toBe(true);
  });
  
  it('handles click events', () => {
    const handleClick = vi.fn();
    
    const button = new ButtonBuilder()
      .withVariant('primary')
      .withSize('md')
      .withChildren('Click Me')
      .withOnClick(handleClick)
      .build();
      
    render(<Button {...button} />);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('can be disabled', () => {
    const handleClick = vi.fn();
    
    const button = new ButtonBuilder()
      .withVariant('primary')
      .withSize('md')
      .withChildren('Disabled Button')
      .withOnClick(handleClick)
      .withProps({ disabled: true })
      .build();
      
    render(<Button {...button} />);
    
    const buttonElement = screen.getByText('Disabled Button');
    expect(buttonElement).toBeDisabled();
    
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });
  
  it('renders with custom className', () => {
    const customClass = 'my-custom-class';
    
    const button = new ButtonBuilder()
      .withVariant('primary')
      .withSize('md')
      .withChildren('Custom Class')
      .withClassName(customClass)
      .build();
      
    render(<Button {...button} />);
    
    const buttonElement = screen.getByText('Custom Class');
    expect(buttonElement.classList.contains(customClass)).toBe(true);
  });
  
  it('renders with data-testid attribute', () => {
    const testId = 'my-test-id';
    
    const button = new ButtonBuilder()
      .withVariant('primary')
      .withSize('md')
      .withChildren('Test ID Button')
      .withProps({ testId })
      .build();
      
    render(<Button {...button} />);
    
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });
  
  it('renders as a child component when asChild is true', () => {
    const button = new ButtonBuilder()
      .withVariant('primary')
      .withSize('md')
      .withChildren('As Child')
      .withProps({ asChild: true })
      .build();
      
    // When asChild is true, we should provide a wrapper component
    // In this test we're using a custom element to test this
    render(
      <Button {...button}>
        <a href="#test">Custom Link</a>
      </Button>
    );
    
    const linkElement = screen.getByText('Custom Link');
    expect(linkElement.tagName).toBe('A');
    expect(linkElement.getAttribute('href')).toBe('#test');
  });

  it('applies neumorphic styles when feature flag is enabled', () => {
    (isFeatureEnabled as any).mockReturnValue(true);

    const buttonProps = new ButtonBuilder()
      .withVariant('neutral')
      .withSize('lg')
      .withChildren('Neumorphic Button')
      .withNeumorph(true)
      .withProps({ testId: 'neumorph-button' })
      .build();

    const { getByTestId } = render(<Button {...buttonProps} />);
    const button = getByTestId('neumorph-button');
    
    expect(button.className).toContain('shadow-neumorph');
    expect(button.className).toContain('bg-neutral');
  });

  it('applies different sizes correctly', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    
    sizes.forEach(size => {
      const buttonProps = new ButtonBuilder()
        .withVariant('primary')
        .withSize(size)
        .withChildren('Size Test')
        .withProps({ testId: `size-${size}-button` })
        .build();

      const { getByTestId } = render(<Button {...buttonProps} />);
      const button = getByTestId(`size-${size}-button`);
      
      const sizeClasses = {
        sm: 'px-3 py-1.5',
        md: 'px-4 py-2',
        lg: 'px-6 py-3'
      };
      
      expect(button.className).toContain(sizeClasses[size]);
    });
  });

  it('throws error when ButtonBuilder is used without children', () => {
    expect(() => {
      new ButtonBuilder()
        .withVariant('primary')
        .withSize('md')
        .build();
    }).toThrow('Button must have children');
  });

  it('combines custom className with default classes', () => {
    const buttonProps = new ButtonBuilder()
      .withVariant('primary')
      .withSize('md')
      .withChildren('Custom Class')
      .withClassName('custom-test-class')
      .withProps({ testId: 'custom-class-button' })
      .build();

    const { getByTestId } = render(<Button {...buttonProps} />);
    const button = getByTestId('custom-class-button');
    
    expect(button.className).toContain('custom-test-class');
    expect(button.className).toContain('bg-primary');
  });
});