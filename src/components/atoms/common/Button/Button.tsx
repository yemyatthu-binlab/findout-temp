import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Pressable } from 'react-native';
import { cn } from '@/util/helper/twutil';
import { useTranslation } from 'react-i18next';

const buttonVariants = cva(
	'group flex items-center justify-center rounded-md',
	{
		variants: {
			variant: {
				default:
					'bg-patchwork-primary dark:bg-patchwork-primary-dark active:opacity-90',
				outline:
					/* tw */ 'border border-input border-slate-400 bg-background active:opacity-80',
				secondary: /* tw */ 'bg-green-400 active:opacity-80',
			},
			size: {
				default: 'h-10 px-3 py-2 native:h-12 native:px-5 native:py-3',
				sm: 'h-8 rounded-md px-3',
				lg: 'h-11 rounded-md px-8 native:h-14',
				xl: 'h-12 rounded-xl px-8 native:h-16',
				icon: /* tw */ 'h-14 w-14 rounded-full px-1',
				burmese: 'h-12 px-3 py-2 native:h-14',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
	VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<
	React.ElementRef<typeof Pressable>,
	ButtonProps
>(({ className, variant, size, ...props }, ref) => {
	const { i18n } = useTranslation();
	const isBurmese = i18n.language === 'my';

	const appliedSize = size ?? (isBurmese ? 'burmese' : 'default');

	return (
		<Pressable
			className={cn(
				props.disabled && 'opacity-50',
				buttonVariants({ variant, size: appliedSize, className }),
			)}
			ref={ref}
			role="button"
			{...props}
		/>
	);
});
Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
