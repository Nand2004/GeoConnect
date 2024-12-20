const styles = {
    container: {
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      padding: '2rem',
      borderRadius: '1rem',
      fontFamily: 'Arial, sans-serif',
      marginTop: "10px",
      paddingTop: "70px",
      minHeight: "100vh",
      paddingBottom: "150px",
      overflowY: 'auto',
    },
    header: {
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2rem',
      marginBottom: '1rem',
      color: '#FFFFFF',
    },
    controls: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    rangeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    rangeInput: {
      width: '200px',
      accentColor: '#4F46E5',
    },
    rangeValue: {
      color: '#94A3B8',
    },
    createEventButton: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#4F46E5',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    buttonIcon: {
      marginRight: '0.5rem',
    },
    content: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
    },
    eventGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      maxHeight: '600px',
      overflowY: 'auto',
    },
    eventCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1rem',
      padding: '1.5rem',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      border: '1px solid rgba(79, 70, 229, 0.2)',
    },
    eventCardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    eventCardTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      margin: 0,
    },
    eventCategory: {
      background: 'rgba(79, 70, 229, 0.2)',
      color: '#4F46E5',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.5rem',
      fontSize: '0.8rem',
    },
    eventCardContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    eventDetails: {
      display: 'flex',
      justifyContent: 'space-between',
      color: '#94A3B8',
    },
    eventDetailItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    detailIcon: {
      color: '#4F46E5',
    },
    attendeeActions: {
      marginTop: '1rem',
    },
    joinButton: {
      width: '100%',
      padding: '0.5rem',
      backgroundColor: '#10B981',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    leaveButton: {
      width: '100%',
      padding: '0.5rem',
      backgroundColor: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    mapContainer: {
      flex: 1,
      borderRadius: '1rem',
      overflow: 'hidden',
    },
    map: {
      width: '100%',
      height: '100%',
    },
    alert: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#EF4444',
      padding: '1rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    alertIcon: {
      fontSize: '1.5rem',
    },
    message: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      color: '#10B981',
      padding: '1rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    messageIcon: {
      fontSize: '1.5rem',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: '#1E293B',
      padding: '2rem',
      borderRadius: '1rem',
      width: '500px',
      maxWidth: '90%',
    },
    modalTitle: {
      marginBottom: '1.5rem',
      color: '#FFFFFF',
    },
    createEventForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    formInput: {
      padding: '0.5rem',
      borderRadius: '0.5rem',
      border: '1px solid #4F46E5',
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
    },
    formTextarea: {
      padding: '0.5rem',
      borderRadius: '0.5rem',
      border: '1px solid #4F46E5',
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      minHeight: '100px',
    },
    formSelect: {
      padding: '0.5rem',
      borderRadius: '0.5rem',
      border: '1px solid #4F46E5',
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
    },
    modalButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '1rem',
    },
    modalSubmitButton: {
      flex: 1,
      backgroundColor: '#4F46E5',
      color: 'white',
      border: 'none',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
    },
    modalCancelButton: {
      flex: 1,
      backgroundColor: '#EF4444',
      color: 'white',
      border: 'none',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
    },
    infoWindow: {
      color: '#0F172A',
      maxWidth: '250px',
    },
    infoTitle: {
      fontSize: '1.25rem',
      marginBottom: '0.5rem',
    },
    infoDetails: {
      display: 'flex',
      color: 'black',
      alignItems: 'center',
      gap: '0.5rem',
      margin: '0.5rem 0',
    },
    infoIcon: {
      color: '#4F46E5',
    },
    infoWindowContainer: {
      maxWidth: '300px',
      color: 'black',

      padding: '15px',
      fontFamily: 'Arial, sans-serif'
    },
    infoWindowHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
    },
    infoWindowTitle: {
      margin: 0,
      fontSize: '18px',
      fontWeight: 'bold'
    },
    infoWindowCategory: {
      backgroundColor: '#f0f0f0',
      padding: '5px 10px',
      borderRadius: '15px',
      fontSize: '12px'
    },
    infoWindowDetails: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '15px'
    },
    infoWindowDetailItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    infoWindowActions: {
      display: 'flex',
      justifyContent: 'space-between'
    },
  };

  export default styles;
