import React from 'react';

/**
 * Avatar Component
 * User profile picture or initials
 */
export const Avatar = React.forwardRef(({
  src,
  alt = 'Avatar',
  size = 'md',
  initials = '',
  className = '',
  ...props
}, ref) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  };

  const baseStyles = 'inline-flex items-center justify-center rounded-full border-2 border-primary-500 bg-gray-200 dark:bg-slate-600 font-semibold text-gray-700 dark:text-gray-200 flex-shrink-0';

  const computedClassName = `
    ${baseStyles}
    ${sizes[size] || sizes.md}
    ${className}
  `.trim();

  if (src) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={computedClassName}
        {...props}
      />
    );
  }

  return (
    <div ref={ref} className={computedClassName} {...props}>
      {initials || 'A'}
    </div>
  );
});

Avatar.displayName = 'Avatar';

/**
 * AvatarGroup Component
 * Display multiple avatars in a group
 */
export const AvatarGroup = React.forwardRef(({
  avatars = [],
  max = 3,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'flex items-center -space-x-2';
  const computedClassName = `${baseStyles} ${className}`.trim();

  const displayedAvatars = avatars.slice(0, max);
  const remaining = Math.max(0, avatars.length - max);

  return (
    <div ref={ref} className={computedClassName} {...props}>
      {displayedAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          initials={avatar.initials}
          size={size}
          className="border-2 border-white dark:border-slate-800"
        />
      ))}
      {remaining > 0 && (
        <div className={`
          inline-flex items-center justify-center
          rounded-full border-2 border-white dark:border-slate-800
          bg-gray-300 dark:bg-slate-700 font-semibold text-gray-700 dark:text-gray-200
          flex-shrink-0
          ${size === 'xs' ? 'w-6 h-6 text-xs' : ''}
          ${size === 'sm' ? 'w-8 h-8 text-sm' : ''}
          ${size === 'md' ? 'w-10 h-10 text-base' : ''}
          ${size === 'lg' ? 'w-12 h-12 text-lg' : ''}
          ${size === 'xl' ? 'w-16 h-16 text-2xl' : ''}
        `}>
          +{remaining}
        </div>
      )}
    </div>
  );
});

AvatarGroup.displayName = 'AvatarGroup';
