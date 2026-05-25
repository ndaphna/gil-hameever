-- Bot Brief Platform — add CTA button text inside the DM
-- E.g. "תני לי גישה לדוח". When null, the DM is sent without a button.

alter table bots.briefs
  add column cta_button_text text;

comment on column bots.briefs.cta_button_text is
  'Text on the CTA button inside the DM. Optional — if null, only the DM body is sent without a button.';
