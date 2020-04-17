import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    creator: { type: Types.ObjectId, ref: 'User' },
    chat: { type: Types.ObjectId, ref: 'Chat' },
    join_url: String,
    start_url: String,
    createDate: { type: Number, default: Date.now },
});
schema.virtual('id').get(function () {
    return this._id.toHexString();
});
schema.set('toJSON', {
    virtuals: true,
});
export const ConferenceSchema = schema;


/*
{
  uuid: 'UuXTDlhiSyiBO+4kdEEQcQ==',
  id: 92669398964,
  host_id: 'ehgKvfRvR4WWRCPWc4W7qg',
  topic: 'angular13',
  password: '',
  h323_password: '',
  status: 0,
  option_jbh: false,
  option_start_type: 'video',
  option_host_video: true,
  option_participants_video: true,
  option_cn_meeting: false,
  option_enforce_login: false,
  option_enforce_login_domains: '',
  option_in_meeting: false,
  option_audio: 'both',
  option_alternative_hosts: '',
  option_use_pmi: false,
  type: 2,
  start_time: '2020-04-17T00:17:16Z',
  duration: 120,
  timezone: 'Europe/Paris',
  start_url: 'https://zoom.us/s/92669398964?zak=eyJ6bV9za20iOiJ6bV9vMm0iLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjbGllbnQiLCJ1aWQiOiJlaGdLdmZSdlI0V1dSQ1BXYzRXN3FnIiwiaXNzIjoid2ViIiwic3R5IjoxMDAsIndjZCI6ImF3MSIsImNsdCI6MCwic3RrIjoiVUR6NGFCNjlNX2RTZ013RkVGQ3RKenZQZHZvUkh6LWdJVlpnR2E1ZzI4QS5CZ1VnY1dSemNuZFZTbVk1T1VSV2FraHVhMU5TT1dveU5VUldNSFJ6ZUUxclpWTkFaamRsTURjd1kySXlaRE0wWldZeE5qY3hOR1poTlRZd00yUmpOR1JsWm1Gak9UVmpOR0V5TnprM01HTTVPR1ZtTldaaU5XVmhObU16TkRZM1lqTTFaUUFNTTBOQ1FYVnZhVmxUTTNNOUFBTmhkekUiLCJleHAiOjE1ODcwODk4MzcsImlhdCI6MTU4NzA4MjYzNywiYWlkIjoidU1CN3U1Qm9STTZVVGU1T19EcUJzQSIsImNpZCI6IiJ9.lqDnzx4g9Jf-w7URw-Aza7eK6dHDbAqAV9loKoX5iCQ',
  join_url: 'https://zoom.us/j/92669398964',
  created_at: '2020-04-17T00:17:16Z'
}

*/