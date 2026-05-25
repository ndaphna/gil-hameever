-- Bot Brief Platform — add ManyChat follow-up DM (separate from Brevo email)
-- Sent inside ManyChat to subscribers who did not click the CTA, after a delay.

alter table bots.briefs
  add column followup_dm_message text,
  add column followup_dm_delay_minutes int not null default 10;

comment on column bots.briefs.followup_dm_message is
  'Follow-up DM sent inside ManyChat to subscribers who did not click the CTA button.';
comment on column bots.briefs.followup_dm_delay_minutes is
  'Smart Delay (in minutes) between the initial DM and the follow-up DM in ManyChat.';
