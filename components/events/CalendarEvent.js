import dayjs from 'dayjs';

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
export default class CalendarEvent {
  constructor({
    id,
    event_id = null,
    group_id,
    title,

    color,
    all_day = false,
    start_time,
    end_time,
    start_date,
    end_date,
    interval,
    description,
    participants,
    joined,
    rvsp = false,
    roles = null,
    organizer = null,
    category = null,
    category_id,
  }) {
    const startDate = start_date.split('T')[0];
    const endDate = end_date.split('T')[0];

    const extendedProps = {
      start_date: startDate,
      start_time,
      color,
      end_date: endDate,
      end_time,
      description,
      rvsp,
      roles,
      organizer,
      category_id,
      interval,
      participants: parseInt(participants, 10),
      all_day,
    };

    this.extendedProps = extendedProps;

    this.id = parseInt(id, 10) || null;
    this.groupId = group_id;
    this.color = color;
    this.title = title;

    if (event_id) Object.assign(extendedProps, { event_id });

    if (typeof category === 'object') {
      Object.assign(extendedProps, { category: category.name });
    } else {
      Object.assign(extendedProps, { category });
    }

    this.timeText = dayjs(this.start).format('h:mma').replace(/m/g, '');

    if (parseInt(joined, 10)) this.extendedProps.joined = true;
    else this.extendedProps.joined = false;

    if (start_date !== end_date) this.extendedProps.isMultiDay = true;
    else this.extendedProps.isMultiDay = false;
  }

  get isRecurring() {
    return this.extendedProps.interval !== 'once';
  }

  // get allDay() {
  //   return this.isMultiDay ? true : this.extendedProps.all_day;
  // }

  get start() {
    const { start_date, start_time } = this.extendedProps;
    const startDate = start_date.concat('T' + start_time);

    return startDate;
  }

  get end() {
    const { end_date, end_time } = this.extendedProps;
    const endDate = end_date.concat('T' + end_time);
    return endDate;
  }
}
