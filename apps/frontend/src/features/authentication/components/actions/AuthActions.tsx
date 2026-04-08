import { Link } from '@tanstack/react-router';

type AuthActionItem = {
  label: string;
  linkText: string;
  to: string;
};

type AuthActionsProps = {
  actions: AuthActionItem[];
};

export function AuthActions({ actions }: AuthActionsProps) {
  return (
    <div className="flex flex-col gap-3 items-center">
      {actions.map((action, index) => (
        <p
          key={index}
          className="flex text-custom-neutral-800 text-sm font-medium tracking-[1%] leading-[150%] dark:text-custom-neutral-100 items-center"
        >
          {action.label}
          <Link
            to={action.to}
            className="rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-custom-primary-700 font-semibold text-custom-neutral-900 tracking-normal leading-[140%] hover:text-custom-primary-700 dark:text-white dark:ring-custom-neutral-100 p-0.75"
          >
            {action.linkText}
          </Link>
        </p>
      ))}
    </div>
  );
}
