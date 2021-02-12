const state = () => ({
  settings: {
    showVideo: {
      title: 'Show video',
      description: 'Show or hide the video on the index page.',
      value: true,
    },
    showVideoOnMobile: {
      title: 'Show video on mobile',
      description: 'Show or hide the index page video on mobile.',
      value: true,
      validator: () => this.settings.showVideo.value,
    },
    showTestimonies: {
      title: 'Show Testimonies',
      description: 'Show short text blobs of our victims for funnsies.',
      value: true,
    },
    flipInfoBlocksOnEven: {
      title: 'Flip Info block position on Even',
      description:
        'Enable to over ride position of info block. Info block text and image positions will shift depending on order.',
      value: true,
    },
    showRecruitmentButton: {
      title: 'Show recruitment button',
      description:
        'Enables/disables recruitment button on front page and in header. Enables/disables recruitment forms.',
      value: true,
    },
    enableSocialAuthentication: {
      title: 'Enable social authentication',
      description:
        'Enables/disables social authentication through 3rd party services like discord.',
      value: true,
    },
    frontPageVideoUrl: {
      title: 'Video URL',
      description: 'Sets the url for the front page video url.',
      value: 'https://blackout-gaming.s3.amazonaws.com/video/0001-0876.webm',
    },
  },
});

export default state;
