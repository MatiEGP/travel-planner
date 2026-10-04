import type { FC } from 'react';

export interface SocialAuthButtonsProps {
  onGoogleClick?: () => void;
  onAppleClick?: () => void;
  disabled?: boolean;
  tabIndex?: number;
}

export const SocialAuthButtons: FC<SocialAuthButtonsProps> = ({
  onGoogleClick,
  onAppleClick,
  disabled = false,
  tabIndex,
}) => {
  return (
    <div className="w-full">
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
          <span className="bg-white px-3 text-slate-400">
            o continuar con
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onGoogleClick}
          disabled={disabled}
          tabIndex={tabIndex}
          aria-label="Continuar con Google"
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all text-sm font-medium text-slate-700 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {/* Google Icon Vector */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.8l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={onAppleClick}
          disabled={disabled}
          tabIndex={tabIndex}
          aria-label="Continuar con Apple"
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all text-sm font-medium text-slate-700 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {/* Apple Icon Vector */}
          <svg className="w-4 h-4 shrink-0 fill-slate-800 text-slate-800" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.76 1.04-1.82.93-2.88-.9.04-1.98.6-2.62 1.36-.57.65-1.06 1.73-.93 2.76 1 .08 2.01-.48 2.62-1.24z" />
          </svg>
          <span>Apple</span>
        </button>
      </div>
    </div>
  );
};
