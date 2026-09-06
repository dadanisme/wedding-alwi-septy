"use client";

import { useId, useState, useTransition } from "react";
import { rsvpConfig } from "@/lib/event-config";
import { submitRsvpAction } from "@/app/actions/rsvp";
import type { RsvpAttendance, RsvpEntry } from "@/types/database";

interface RsvpProps {
  /**
   * Slug lengkap dari URL tamu ("nama-slug-token"). Bila kosong, seksi berjalan
   * dalam mode pratinjau (rute "/" tanpa tamu): formulir tetap dapat dicoba,
   * tetapi tidak ada penulisan ke basis data.
   */
  fullSlug?: string;
  /** Jawaban RSVP tersimpan, bila tamu sudah pernah mengisi (PRD §4.3). */
  initialRsvp?: RsvpEntry | null;
}

/**
 * Merangkai ringkasan jawaban tersimpan untuk kartu konfirmasi tamu yang kembali,
 * mis. "Hadir · bersama 1 pendamping (Rina)".
 */
function buildSummary(rsvp: RsvpEntry): string {
  if (rsvp.attendance !== "attending") {
    return rsvpConfig.summaryNotAttending;
  }

  const companion = rsvp.plusOne
    ? `${rsvpConfig.summaryWithPlusOne}${
        rsvp.plusOneName ? ` (${rsvp.plusOneName})` : ""
      }`
    : rsvpConfig.summaryWithoutPlusOne;

  return `${rsvpConfig.summaryAttending} · ${companion}`;
}

export function Rsvp({ fullSlug, initialRsvp = null }: RsvpProps) {
  const [attendance, setAttendance] = useState<RsvpAttendance>(
    initialRsvp?.attendance ?? "attending"
  );
  const [hasPlusOne, setHasPlusOne] = useState(initialRsvp?.plusOne ?? false);
  const [plusOneName, setPlusOneName] = useState(initialRsvp?.plusOneName ?? "");
  const [note, setNote] = useState(initialRsvp?.notes ?? "");

  // Jawaban yang sudah tersimpan. Selama ini terisi dan tamu tidak sedang
  // menyunting, kartu konfirmasi yang ditampilkan — bukan formulirnya.
  const [savedRsvp, setSavedRsvp] = useState<RsvpEntry | null>(initialRsvp);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const plusOneNameId = useId();
  const noteId = useId();
  const errorId = useId();

  const showForm = savedRsvp === null || isEditing;

  // Tanpa fullSlug tidak ada tamu untuk disimpani, jadi pengiriman dimatikan.
  const isPreview = !fullSlug;

  // Hitung apakah tanggal anjuran RSVP sudah lewat
  const isPastDeadline =
    new Date().toISOString().slice(0, 10) > rsvpConfig.suggestedDeadline;
  const deadlinePrompt = isPastDeadline
    ? rsvpConfig.promptAfterDeadline
    : rsvpConfig.promptBeforeDeadline;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    setError(null);

    // Mode pratinjau ("/" tanpa data tamu). Tombol kirim sudah dinonaktifkan,
    // ini penjaga terakhir: jangan pernah menampilkan kartu "tersimpan" untuk
    // jawaban yang tidak pernah ditulis ke mana pun.
    if (!fullSlug) return;

    const trimmedPlusOneName = plusOneName.trim();
    const trimmedNote = note.trim();
    const isAttending = attendance === "attending";
    const willBringPlusOne = isAttending && hasPlusOne;

    if (willBringPlusOne && !trimmedPlusOneName) {
      setError(rsvpConfig.errorPlusOneNameRequired);
      return;
    }

    startTransition(async () => {
      // Wajib ditangkap di sini. Server Action punya try/catch sendiri, tetapi
      // kegagalan transport (tamu kehilangan sinyal di tengah kirim) menolak
      // promise-nya sebelum kode server sempat jalan. Rejeksi yang lolos dari
      // startTransition diperlakukan React sebagai galat render dan MENGGANTI
      // seluruh halaman undangan dengan layar galat — bukan hanya seksi ini.
      try {
        const result = await submitRsvpAction({
          fullSlug,
          attendance,
          plusOne: willBringPlusOne,
          plusOneName: trimmedPlusOneName,
          notes: trimmedNote,
        });

        if (!result.success) {
          setError(result.error);
          return;
        }

        setSavedRsvp(result.rsvp);
        setIsEditing(false);
      } catch (err) {
        console.warn("Gagal mengirim RSVP:", err);
        setError(rsvpConfig.errorGeneric);
      }
    });
  };

  const handleEdit = () => {
    setError(null);
    setIsEditing(true);
  };

  // Jalan pulang dari mode ubah. Tanpa ini, tamu yang menekan "Ubah Konfirmasi"
  // sekadar untuk melihat jawabannya terjebak di formulir sampai ia mengirim
  // ulang atau memuat ulang halaman.
  const handleCancel = () => {
    if (!savedRsvp) return;
    setAttendance(savedRsvp.attendance);
    setHasPlusOne(savedRsvp.plusOne);
    setPlusOneName(savedRsvp.plusOneName ?? "");
    setNote(savedRsvp.notes ?? "");
    setError(null);
    setIsEditing(false);
  };

  return (
    <section
      id="rsvp"
      aria-labelledby="rsvp-title"
      className="relative overflow-hidden bg-cream"
    >
      {/* Latar motif damask botani melati berulang */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-8"
        aria-hidden="true"
      >
        <rect width="100%" height="100%" fill="url(#damaskPat)" />
      </svg>

      {/* Ornamen sulur sudut kiri & kanan atas (khusus desktop) */}
      <svg
        className="pointer-events-none absolute top-[80px] left-[20px] hidden h-[180px] w-[180px] opacity-40 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>
      <svg
        className="pointer-events-none absolute top-[80px] right-[20px] hidden h-[180px] w-[180px] -scale-x-100 opacity-40 lg:block"
        aria-hidden="true"
      >
        <use href="#sulur" />
      </svg>

      {/* Konten Seksi */}
      <div className="relative flex flex-col items-center gap-[22px] px-[30px] pt-[52px] pb-[56px] lg:gap-[34px] lg:px-[40px] lg:pt-[88px] lg:pb-[96px]">
        {/* Header Seksi */}
        <div className="flex flex-col items-center gap-[10px] lg:gap-[14px]">
          <svg
            className="h-[18px] w-[140px] opacity-85 lg:h-[24px] lg:w-[200px]"
            aria-hidden="true"
          >
            <use href="#orn" />
          </svg>
          <h2
            id="rsvp-title"
            className="text-section-label lg:text-section-label-lg indent-[0.4em] text-ink-soft lg:indent-[0.48em]"
          >
            RSVP
          </h2>
          <p className="text-rsvp-desc lg:text-rsvp-desc-lg max-w-[280px] text-center text-ink-soft text-pretty lg:max-w-[560px]">
            {deadlinePrompt}
          </p>
        </div>

        {showForm ? (
          /* Formulir RSVP */
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-[18px] lg:max-w-[560px] lg:gap-[24px]"
          >
            {/* Fieldset Kehadiran */}
            <fieldset className="m-0 flex flex-col gap-[9px] border-0 p-0 lg:gap-[10px]">
              <legend className="text-rsvp-legend lg:text-rsvp-legend-lg pb-[9px] text-ink-soft lg:pb-[10px]">
                Kehadiran
              </legend>
              <div className="flex flex-col gap-[9px] lg:grid lg:grid-cols-2 lg:gap-[10px]">
                <label
                  className={`flex cursor-pointer items-center gap-[11px] border border-gold-bright/65 bg-white/50 p-[14px_15px] text-rsvp-option text-ink transition-colors lg:gap-[12px] lg:p-[16px_18px] lg:text-rsvp-option-lg hover:border-gold-deep hover:bg-white/70 ${
                    attendance === "attending"
                      ? "border-gold-deep bg-white/80 shadow-xs"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value="attending"
                    checked={attendance === "attending"}
                    onChange={() => setAttendance("attending")}
                    className="h-[16px] w-[16px] accent-gold-deep lg:h-[17px] lg:w-[17px]"
                  />
                  <span>Ya, saya akan hadir</span>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-[11px] border border-gold-bright/65 bg-white/50 p-[14px_15px] text-rsvp-option text-ink transition-colors lg:gap-[12px] lg:p-[16px_18px] lg:text-rsvp-option-lg hover:border-gold-deep hover:bg-white/70 ${
                    attendance === "not_attending"
                      ? "border-gold-deep bg-white/80 shadow-xs"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value="not_attending"
                    checked={attendance === "not_attending"}
                    onChange={() => {
                      setAttendance("not_attending");
                      setHasPlusOne(false);
                    }}
                    className="h-[16px] w-[16px] accent-gold-deep lg:h-[17px] lg:w-[17px]"
                  />
                  <span>Maaf, belum bisa hadir</span>
                </label>
              </div>
            </fieldset>

            {/* Fieldset Membawa Pendamping? (Hanya bila hadir) */}
            {attendance === "attending" && (
              <fieldset className="m-0 flex flex-col gap-[9px] border-0 p-0 lg:gap-[10px]">
                <legend className="text-rsvp-legend lg:text-rsvp-legend-lg pb-[9px] text-ink-soft lg:pb-[10px]">
                  Membawa Pendamping?
                </legend>
                <div className="flex gap-[9px] lg:gap-[10px]">
                  <label
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-[9px] border border-gold-bright/65 bg-white/50 p-[13px] text-rsvp-option text-ink transition-colors lg:gap-[10px] lg:p-[15px] lg:text-rsvp-option-lg hover:border-gold-deep hover:bg-white/70 ${
                      hasPlusOne
                        ? "border-gold-deep bg-white/80 shadow-xs"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="hasPlusOne"
                      value="ya"
                      checked={hasPlusOne}
                      onChange={() => setHasPlusOne(true)}
                      className="h-[15px] w-[15px] accent-gold-deep lg:h-[16px] lg:w-[16px]"
                    />
                    <span>Ya</span>
                  </label>

                  <label
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-[9px] border border-gold-bright/65 bg-white/50 p-[13px] text-rsvp-option text-ink transition-colors lg:gap-[10px] lg:p-[15px] lg:text-rsvp-option-lg hover:border-gold-deep hover:bg-white/70 ${
                      !hasPlusOne
                        ? "border-gold-deep bg-white/80 shadow-xs"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="hasPlusOne"
                      value="tidak"
                      checked={!hasPlusOne}
                      onChange={() => {
                        setHasPlusOne(false);
                        setPlusOneName("");
                      }}
                      className="h-[15px] w-[15px] accent-gold-deep lg:h-[16px] lg:w-[16px]"
                    />
                    <span>Tidak</span>
                  </label>
                </div>
              </fieldset>
            )}

            {/* Input Nama Pendamping (Kondisional: jika hadir & bawa pendamping) */}
            {attendance === "attending" && hasPlusOne && (
              <label
                htmlFor={plusOneNameId}
                className="flex flex-col gap-[8px] lg:gap-[9px]"
              >
                <span className="text-rsvp-legend lg:text-rsvp-legend-lg text-ink-soft">
                  Nama Pendamping
                </span>
                <input
                  id={plusOneNameId}
                  type="text"
                  value={plusOneName}
                  onChange={(e) => setPlusOneName(e.target.value)}
                  placeholder="Nama pendamping Anda"
                  required={hasPlusOne}
                  maxLength={rsvpConfig.maxPlusOneNameLength}
                  className="border-b border-gold-bright/75 bg-transparent p-[11px_2px] text-rsvp-input text-ink outline-none transition-colors placeholder:text-ink-soft/40 focus:border-gold-deep lg:p-[12px_2px] lg:text-rsvp-input-lg"
                />
              </label>
            )}

            {/* Input Catatan Singkat */}
            <label
              htmlFor={noteId}
              className="flex flex-col gap-[8px] lg:gap-[9px]"
            >
              <span className="text-rsvp-legend lg:text-rsvp-legend-lg text-ink-soft">
                {rsvpConfig.notesLabel}
              </span>
              <textarea
                id={noteId}
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={rsvpConfig.notesPlaceholder}
                maxLength={rsvpConfig.maxNotesLength}
                className="border border-gold-bright/65 bg-white/50 p-[12px] text-rsvp-input text-ink outline-none transition-colors resize-y placeholder:text-ink-soft/40 focus:border-gold-deep lg:p-[14px] lg:text-rsvp-input-lg"
              />
            </label>

            {/* Pesan galat — memakai aksen emas, bukan warna galat baru di luar palet */}
            {error && (
              <p
                id={errorId}
                role="alert"
                className="text-rsvp-desc lg:text-rsvp-desc-lg border border-gold-deep bg-white/70 p-[12px_14px] text-center text-ink text-pretty lg:p-[14px_16px]"
              >
                {error}
              </p>
            )}

            {/* Tombol Kirim, dan Batal bila tamu sedang mengubah jawaban tersimpan */}
            <div className="mt-[4px] flex flex-col gap-[10px] lg:flex-row lg:items-center lg:justify-center lg:gap-[14px]">
              <button
                type="submit"
                disabled={isPending || isPreview}
                aria-busy={isPending}
                aria-describedby={error ? errorId : undefined}
                className="cursor-pointer border border-gold-deep bg-gold-deep p-[16px] text-rsvp-btn tracking-[0.32em] text-on-photo uppercase indent-[0.32em] transition-colors duration-300 hover:bg-[#6e5419] disabled:cursor-not-allowed disabled:opacity-55 lg:p-[17px_44px] lg:text-rsvp-btn-lg lg:tracking-[0.36em] lg:indent-[0.36em]"
              >
                {isPending ? rsvpConfig.submittingLabel : rsvpConfig.submitLabel}
              </button>

              {savedRsvp && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isPending}
                  className="cursor-pointer border border-gold-deep/60 bg-transparent p-[14px] text-rsvp-btn tracking-[0.28em] text-ink-soft uppercase indent-[0.28em] transition-colors duration-300 hover:border-gold-deep hover:bg-gold-deep hover:text-on-photo disabled:cursor-not-allowed disabled:opacity-55 lg:p-[15px_30px]"
                >
                  {rsvpConfig.cancelButtonLabel}
                </button>
              )}
            </div>

            {/* Hanya terlihat di "/" — tamu sungguhan selalu punya link pribadi */}
            {isPreview && (
              <p className="text-rsvp-thanks-sub lg:text-rsvp-thanks-sub-lg text-center text-ink-soft text-pretty">
                {rsvpConfig.previewNotice}
              </p>
            )}
          </form>
        ) : savedRsvp ? (
          /* Kartu Konfirmasi / Umpan Balik Sukses */
          <div className="flex w-full flex-col items-center gap-[10px] border border-gold-bright/70 bg-white/55 p-[26px_22px] text-center lg:max-w-[560px] lg:gap-[14px] lg:p-[38px_32px]">
            <svg
              className="h-[16px] w-[110px] opacity-85 lg:h-[20px] lg:w-[160px]"
              aria-hidden="true"
            >
              <use href="#orn" />
            </svg>
            <p className="text-rsvp-thanks-title lg:text-rsvp-thanks-title-lg text-ink">
              {rsvpConfig.successTitle}
            </p>
            <p className="text-rsvp-thanks-sub lg:text-rsvp-thanks-sub-lg text-ink-soft">
              {savedRsvp.attendance === "attending"
                ? rsvpConfig.successAttending
                : rsvpConfig.successNotAttending}
            </p>

            {/* Ringkasan jawaban tersimpan, supaya tamu yang kembali langsung
                tahu apa yang tercatat tanpa perlu membuka formulirnya. */}
            <div className="mt-[4px] flex w-full flex-col gap-[5px] border border-gold-bright/55 bg-cream/70 p-[12px_14px] lg:mt-[6px] lg:gap-[6px] lg:p-[14px_18px]">
              <p className="text-rsvp-summary lg:text-rsvp-summary-lg text-ink text-pretty">
                {buildSummary(savedRsvp)}
              </p>
              {savedRsvp.notes ? (
                <p className="text-rsvp-summary lg:text-rsvp-summary-lg text-ink-soft text-pretty">
                  {rsvpConfig.summaryNotesPrefix}: {savedRsvp.notes}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleEdit}
              className="mt-[10px] cursor-pointer border border-gold-deep/60 bg-transparent px-[22px] py-[10px] text-rsvp-btn tracking-[0.28em] text-ink-soft uppercase indent-[0.28em] transition-colors duration-300 hover:border-gold-deep hover:bg-gold-deep hover:text-on-photo"
            >
              {rsvpConfig.editButtonLabel}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
