/**
 * @property {Number|Object} id The events id. Defaults to null if no id is provided.
 * @property {String} name The event name.
 * @property {String} color The chosen color of the event.
 * @property {Number} year The year of the event in number format.
 * @property {Number} month The month of the event in number format.
 * @property {Number} day The day of the event in number format.
 * @property {Number} category The category id of the event.
 * @property {String} start_date The start date in string format.
 * @property {String} start_time The start time in string format.
 * @property {String} end_date The optional end date of an event. Defaults to start_date.
 * @property {String} end_time The optional end time of an event. Defaults to start_time.
 * @property {String} description The description of the event.
 * @property {Boolean} rvsp Enables or disables the privilage for users to register for an event. Defaults to false.
 * @property {Object} organizer Object containing the id, avatar and username of the event submitter/organizer. Defaults to null.
 * @property {Object} category Object containing the id, name and banner background source for the category the event is bound to. Defaults to null.
 */
export default class CalendarEvent {
  constructor({
    id,
    name,
    color,
    year,
    month,
    day,
    start_date,
    start_time,
    end_date,
    end_time,
    description,
    rvsp,
    roles = null,
    organizer = null,
    category = null,
  }) {
    // const dates = start_date.split("-");
    this.id = id || null;
    // this.year = year || parseInt(dates[0], 10);
    // this.month = month || parseInt(dates[1], 10);
    // this.day = day || parseInt(dates[2], 10);
    this.name = name;
    this.color = color || '#000000';
    this.start_date = start_date.split('T')[0];
    this.start_time = start_time;
    this.end_date = end_date.split('T')[0] || start_date;
    this.end_time = end_time || start_time;
    this.description = description;
    this.rvsp = rvsp || false;
    this.organizer = organizer;
    this.category = category;
    this.roles = roles;
  }

  get start() {
    return this.start_date && this.start_time
      ? this.start_date + ' ' + this.start_time
      : null;
  }

  get end() {
    return this.end_date && this.end_time
      ? this.end_date + ' ' + this.end_time
      : null;
  }

  get category_id() {
    return this.category.id || 1;
  }

  get categoryName() {
    return this.category.name || '';
  }
}
