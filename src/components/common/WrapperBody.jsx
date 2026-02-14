const WrapperBody = ({
  children,
  className = "",
  padding = "md",
  spacing = "md",
  showBg = false,
  bgColor = "white",
  bgOpacity = "100",
  rounded = "none",
  shadow = "none",
  border = false,
  borderColor = "gray",
  borderWidth = "1",
  maxWidth = "none",
  centered = false,
  scrollable = false,
  maxHeight,
  minHeight,
  id,
  "aria-label": ariaLabel,
}) => {
  const paddingClasses = {
    none: "px-0 py-0",
    xs: "px-2 py-1",
    sm: "px-4 py-2",
    md: "px-6 py-4",
    lg: "px-8 py-6",
    xl: "px-10 py-8",
  };

  const spacingClasses = {
    none: "space-y-0",
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6",
  };

  const bgColorClasses = {
    white: "bg-white dark:bg-neutral-700",
    gray: "bg-gray-50 dark:bg-gray-800/80",
    primary: "bg-red-50 dark:bg-red-900/20",
    secondary: "bg-purple-50 dark:bg-purple-900/20",
    transparent: "bg-transparent",
  };

  const bgOpacityClasses = {
    0: "bg-opacity-0",
    5: "bg-opacity-5",
    10: "bg-opacity-10",
    20: "bg-opacity-20",
    30: "bg-opacity-30",
    40: "bg-opacity-40",
    50: "bg-opacity-50",
    60: "bg-opacity-60",
    70: "bg-opacity-70",
    80: "bg-opacity-80",
    90: "bg-opacity-90",
    100: "bg-opacity-100",
  };

  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-2xl",
  };

  const shadowClasses = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    inner: "shadow-inner",
  };

  const borderColorClasses = {
    gray: "border-gray-200 dark:border-gray-700",
    primary: "border-blue-200 dark:border-blue-800",
    secondary: "border-purple-200 dark:border-purple-800",
    error: "border-red-200 dark:border-red-800",
    warning: "border-yellow-200 dark:border-yellow-800",
    success: "border-green-200 dark:border-green-800",
  };

  const borderWidthClasses = {
    0: "border-0",
    1: "border",
    2: "border-2",
    4: "border-4",
    8: "border-8",
  };

  const maxWidthClasses = {
    none: "max-w-none",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
  };

  const centeredClass = centered ? "mx-auto" : "";
  const textColorClass = "text-gray-700 dark:text-gray-200";
  const bgClass = showBg ? bgColorClasses[bgColor] : "";
  const bgOpacityClass = showBg ? bgOpacityClasses[bgOpacity] : "";
  const borderClass = border
    ? `${borderWidthClasses[borderWidth]} ${borderColorClasses[borderColor]}`
    : "";
  const scrollableClass = scrollable ? "overflow-auto" : "";

  const inlineStyles = {
    ...(maxHeight && { maxHeight }),
    ...(minHeight && { minHeight }),
  };

  return (
    <div
      id={id}
      className={`
        ${paddingClasses[padding]}
        ${spacingClasses[spacing]}
        ${textColorClass}
        ${bgClass}
        ${bgOpacityClass}
        ${roundedClasses[rounded]}
        ${shadowClasses[shadow]}
        ${borderClass}
        ${maxWidthClasses[maxWidth]}
        ${centeredClass}
        ${scrollableClass}
        ${className}
      `}
      style={inlineStyles}
      role="region"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

// Compound components for common layouts
WrapperBody.Section = ({ children, className = "", ...props }) => (
  <WrapperBody padding="sm" {...props} className={className}>
    {children}
  </WrapperBody>
);

WrapperBody.Grid = ({
  children,
  cols = 2,
  gap = 4,
  className = "",
  ...props
}) => {
  const colClasses = {
    1: "grid-cols-1",

    2: "grid-cols-1 sm:grid-cols-2",
    "2-md": "grid-cols-1 md:grid-cols-2",
    "2-lg": "grid-cols-1 lg:grid-cols-2",
    "2-xl": "grid-cols-1 xl:grid-cols-2",
    "2-2xl": "grid-cols-1 2xl:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "3-sm": "grid-cols-1 sm:grid-cols-3",
    "3-md": "grid-cols-1 md:grid-cols-3",
    "3-lg": "grid-cols-1 lg:grid-cols-3",
    "3-md-lg": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    "4-sm": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    "4-md": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    "4-lg": "grid-cols-1 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    "5-md": "grid-cols-1 md:grid-cols-3 lg:grid-cols-5",
    "5-lg": "grid-cols-1 lg:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    "6-md": "grid-cols-1 md:grid-cols-3 lg:grid-cols-6",
    "6-lg": "grid-cols-1 lg:grid-cols-6",
    "auto-100":
      "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
    "auto-120":
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
    "auto-150":
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4",
    "auto-200":
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3",
  };

  return (
    <div
      className={`grid ${colClasses[cols]} gap-${gap} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

WrapperBody.Flex = ({
  children,
  direction = "row",
  align = "stretch",
  justify = "start",
  gap = 4,
  wrap = false,
  className = "",
}) => {
  const directionClasses = {
    row: "flex-row",
    col: "flex-col",
    "row-reverse": "flex-row-reverse",
    "col-reverse": "flex-col-reverse",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const wrapClass = wrap ? "flex-wrap" : "flex-nowrap";

  return (
    <div
      className={`flex ${directionClasses[direction]} ${alignClasses[align]} ${justifyClasses[justify]} ${wrapClass} gap-${gap} ${className}`}
    >
      {children}
    </div>
  );
};

WrapperBody.Divider = ({ className = "" }) => (
  <div
    className={`my-4 border-t border-gray-300 dark:border-neutral-500/80 ${className}`}
  />
);

WrapperBody.Title = ({ children, className = "", as = "h3" }) => {
  const Component = as;
  const baseClasses = "font-semibold text-gray-900 dark:text-white";
  const sizeClasses = {
    h1: "text-2xl md:text-3xl",
    h2: "text-xl md:text-2xl",
    h3: "text-lg md:text-xl",
    h4: "text-base md:text-lg",
    h5: "text-sm md:text-base",
    h6: "text-xs md:text-sm",
    p: "text-base",
    span: "text-base",
  };

  return (
    <Component className={`${baseClasses} ${sizeClasses[as]} ${className}`}>
      {children}
    </Component>
  );
};

WrapperBody.Text = ({
  children,
  className = "",
  size = "base",
  muted = false,
}) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const mutedClass = muted ? "text-gray-500 dark:text-gray-400" : "";

  return (
    <p className={`${sizeClasses[size]} ${mutedClass} ${className}`}>
      {children}
    </p>
  );
};

WrapperBody.Icon = ({ children, className = "" }) => (
  <div className={`shrink-0 ${className}`}>{children}</div>
);

WrapperBody.Actions = ({ children, className = "" }) => (
  <div className={`flex items-center justify-end gap-3 mt-4 ${className}`}>
    {children}
  </div>
);

WrapperBody.Card = ({
  children,
  className = "",
  padding = "lg",
  shadow = "md",
  border = false,
  hoverable = false,
  clickable = false,
  onClick,
  image,
  imagePosition = "top",
  imageHeight = "200px",
  imageFit = "cover",
  title,
  subtitle,
  description,
  footer,
  actions,
  ...props
}) => {
  const baseCardClasses = `
    ${hoverable ? "transition-all duration-300 hover:shadow-lg hover:-translate-y-1" : ""}
    ${clickable ? "cursor-pointer" : ""}
  `;

  const imagePositionClasses = {
    top: "flex-col",
    bottom: "flex-col-reverse",
    left: "flex-row",
    right: "flex-row-reverse",
  };

  const imageSizeClasses = {
    top: "w-full",
    bottom: "w-full",
    left: "w-32 md:w-48",
    right: "w-32 md:w-48",
  };

  // Card with image in different positions
  if (image) {
    return (
      <WrapperBody
        padding="none"
        rounded="lg"
        shadow={shadow}
        border={border}
        className={`overflow-hidden ${baseCardClasses} ${className}`}
        onClick={onClick}
        {...props}
      >
        <div className={`flex ${imagePositionClasses[imagePosition]} h-full`}>
          {/* Image container */}
          <div
            className={`${imageSizeClasses[imagePosition]} shrink-0 bg-gray-100 dark:bg-gray-800`}
            style={{
              height: ["top", "bottom"].includes(imagePosition)
                ? imageHeight
                : "auto",
            }}
          >
            {typeof image === "string" ? (
              <img
                src={image}
                alt={title || "Card image"}
                className={`w-full h-full object-${imageFit}`}
              />
            ) : (
              image
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 md:p-6">
            {/* Title & Subtitle */}
            {(title || subtitle) && (
              <div className="mb-3">
                {title && (
                  <WrapperBody.Title as="h3" className="text-lg md:text-xl">
                    {title}
                  </WrapperBody.Title>
                )}
                {subtitle && (
                  <WrapperBody.Text size="sm" muted className="mt-1">
                    {subtitle}
                  </WrapperBody.Text>
                )}
              </div>
            )}

            {/* Description */}
            {description && (
              <WrapperBody.Text
                size="sm"
                className="text-gray-600 dark:text-gray-300"
              >
                {description}
              </WrapperBody.Text>
            )}

            {/* Children content */}
            {children}

            {/* Actions */}
            {actions && (
              <div className="mt-4 flex items-center gap-3">{actions}</div>
            )}
          </div>
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 bg-gray-50 dark:bg-gray-800/50">
            {footer}
          </div>
        )}
      </WrapperBody>
    );
  }

  // Standard card without image
  return (
    <WrapperBody
      padding={padding}
      rounded="lg"
      shadow={shadow}
      border={border}
      className={`${baseCardClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* Title & Subtitle */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <WrapperBody.Title as="h3" className="text-lg md:text-xl">
              {title}
            </WrapperBody.Title>
          )}
          {subtitle && (
            <WrapperBody.Text size="sm" muted className="mt-1">
              {subtitle}
            </WrapperBody.Text>
          )}
        </div>
      )}

      {/* Description */}
      {description && (
        <WrapperBody.Text
          size="sm"
          className="text-gray-600 dark:text-gray-300 mb-4"
        >
          {description}
        </WrapperBody.Text>
      )}

      {/* Children content */}
      {children}

      {/* Actions */}
      {actions && <div className="mt-5 flex items-center gap-3">{actions}</div>}

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </WrapperBody>
  );
};

// Pre-built card variants
WrapperBody.Card.Product = ({ product, className = "", ...props }) => (
  <WrapperBody.Card
    padding="md"
    border
    shadow="sm"
    hoverable
    image={product.image}
    imagePosition="top"
    imageHeight="180px"
    imageFit="contain"
    title={product.name}
    subtitle={`$${product.price}`}
    description={product.description}
    actions={
      <>
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Add to Cart
        </button>
        <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </>
    }
    className={className}
    {...props}
  />
);

WrapperBody.Card.User = ({ user, className = "", ...props }) => (
  <WrapperBody.Card
    padding="lg"
    border
    shadow="md"
    image={user.avatar}
    imagePosition="left"
    imageFit="cover"
    title={`${user.firstName} ${user.lastName}`}
    subtitle={user.role}
    description={user.bio}
    footer={
      <div className="flex justify-between items-center">
        <WrapperBody.Text size="xs" muted>
          Member since {new Date(user.joinedAt).toLocaleDateString()}
        </WrapperBody.Text>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            user.status === "active"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {user.status}
        </span>
      </div>
    }
    actions={
      <>
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          Message
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          View Profile
        </button>
      </>
    }
    className={className}
    {...props}
  />
);

WrapperBody.Card.Post = ({ post, className = "", ...props }) => (
  <WrapperBody.Card
    padding="lg"
    border={false}
    shadow="none"
    className={`bg-white dark:bg-gray-900 ${className}`}
    {...props}
  >
    <div className="flex items-start gap-3 mb-4">
      <img
        src={post.author.avatar}
        alt={post.author.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <WrapperBody.Title as="h4" className="text-base">
          {post.author.name}
        </WrapperBody.Title>
        <WrapperBody.Text size="xs" muted>
          {post.timestamp} • {post.readTime} min read
        </WrapperBody.Text>
      </div>
    </div>

    <WrapperBody.Title as="h3" className="text-xl mb-2">
      {post.title}
    </WrapperBody.Title>

    {post.image && (
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
    )}

    <WrapperBody.Text className="mb-4">{post.excerpt}</WrapperBody.Text>

    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {post.likes}
      </button>
      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {post.comments}
      </button>
      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        Share
      </button>
    </div>
  </WrapperBody.Card>
);

WrapperBody.Card.Stats = ({
  title,
  value,
  icon,
  trend,
  color = "blue",
  className = "",
  ...props
}) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    yellow:
      "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    purple:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  };

  return (
    <WrapperBody.Card
      padding="lg"
      border
      shadow="sm"
      className={className}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <WrapperBody.Text
            size="sm"
            muted
            className="uppercase tracking-wider"
          >
            {title}
          </WrapperBody.Text>
          <WrapperBody.Title as="h2" className="text-2xl md:text-3xl mt-1">
            {value}
          </WrapperBody.Title>
          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 text-xs font-medium ${
                trend > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              <span>
                {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                vs last month
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}
          >
            {icon}
          </div>
        )}
      </div>
    </WrapperBody.Card>
  );
};

export default WrapperBody;
