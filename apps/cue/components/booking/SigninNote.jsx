import OtpFields from '@/components/account/OtpFields';
import { REFMSG_ERR } from '@/components/ui/modalClasses';

// Sign-in code entry shown on both success screens; the booking is already saved either way.
export default function SigninNote({ otpVerified, signinEmail, otpCode, setOtpCode, doOtpVerify, otpMsg, otpBusy, otpCooldown, resendOtp }) {
  return (
    <div data-signin-note className="-mt-3 mb-6">
      {otpVerified ? (
        <p className="text-small text-muted leading-[var(--lh-body)]">
          Signed in as <strong className="text-green">{signinEmail}</strong>.
        </p>
      ) : (
        <>
          <p className="mb-3 text-small text-muted leading-[var(--lh-body)] text-center">
            You booked as <strong className="text-green">{signinEmail}</strong>. Enter the
            6-digit code we sent that inbox to sign in.
          </p>
          <OtpFields
            length={6}
            value={otpCode}
            onChange={setOtpCode}
            onComplete={doOtpVerify}
            error={!!otpMsg}
            disabled={otpBusy}
          />
          {otpMsg && <small role="alert" className={`${REFMSG_ERR} text-center mt-3`}>{otpMsg}</small>}
          <p className="mt-3 text-center text-small text-muted">
            {otpCooldown > 0 ? `Resend code in ${otpCooldown}s` : (
              <button type="button" className="bg-transparent border-none p-0 cursor-pointer font-body text-small text-gold font-semibold underline hover:text-gold-d" onClick={resendOtp}>Resend code</button>
            )}
          </p>
        </>
      )}
    </div>
  );
}
