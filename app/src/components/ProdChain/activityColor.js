const activityColor = (activity_type) => {
  switch(activity_type) {
    case 'purchase': return '#e6ab02';
    case 'manufacturing': return '#ff7f00';
    case 'copying': return '#4daf4a';
    case 'invention': return '#377eb8';
    default: return '#000000';
  }
};

export default activityColor;
