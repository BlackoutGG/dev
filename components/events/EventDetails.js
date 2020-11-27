/**
 * @property {Number|Object} id The events id. Defaults to null if no id is provided.
 * @property {String} name The event name.
 * @property {String} color The chosen color of the event.
 * @property {Boolean} all_day An boolean dictating whether an event runs all day. Default false.
 * @property {Number} category The category object containing an id and name.
 * @property {Number} category_id The category id of the event
 * @property {String} start_date The start date in string format.
 * @property {String} end_date The optional end date of an event. Defaults to start_date.
 * @property {String} interval The interval of the event. Can run once, daily, weekly or monthly.
 * @property {String} description The description of the event.
 * @property {Boolean} rvsp Enables or disables the privilage for users to register for an event. Defaults to false.
 * @property {Object} organizer Object containing the id, avatar and username of the event submitter/organizer. Defaults to null.
 * @property {Object} category Object containing the id, name and banner background source for the category the event is bound to. Defaults to null.
 */
export default class EventDetails {
  constructor({
    id,
    event_id,
    group_id,
    title = '',
    color = '',
    all_day = false,
    start_date,
    start_time,
    end_date,
    end_time,
    interval = 'once',
    description = '',
    rvsp = false,
    category_id,
  }) {
    // const startValues = start_date.split('T');
    // const endValues = end_date.split('T');
    // const startDate = startValues[0];
    // const startTime = startValues[1].substr(0, startValues[1].lastIndexOf(':'));
    // const endDate = endValues[0];
    // const endTime = endValues[1].substr(0, endValues[1].lastIndexOf(':'));

    const startDate = start_date.split('T')[0];
    const endDate = end_date.split('T')[0];

    this.id = id;
    this.group_id = group_id;
    this.event_id = event_id;
    this.title = title;
    this.all_day = all_day;
    this.start_date = start_date ? startDate : '';
    this.start_time = start_time ? start_time : '';
    this.end_date = end_date ? endDate : '';
    this.end_time = end_time ? end_time : '';
    this.rvsp = rvsp;
    this.description = description;
    this.interval = interval;
    this.color = color;
    this.category_id = category_id;
  }

  get isRecurring() {
    return this.interval !== 'once';
  }
}
