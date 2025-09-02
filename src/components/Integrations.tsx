const Integrations = () => {
  const integrations = [
    {
      name: "Zoom",
      logo: "https://logos-world.net/wp-content/uploads/2020/12/Zoom-Logo.png",
      description: "Seamless video conferencing"
    },
    {
      name: "Google Calendar",
      logo: "https://developers.google.com/calendar/images/calendar_icon.png",
      description: "Smart scheduling integration"
    },
    {
      name: "Slack",
      logo: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png",
      description: "Team communication"
    },
    {
      name: "Notion",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
      description: "Note-taking & organization"
    },
    {
      name: "Google Drive",
      logo: "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png",
      description: "File sharing & storage"
    },
    {
      name: "Discord",
      logo: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png",
      description: "Voice & text communication"
    }
  ];

  return (
    <section className="section-spacing bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Works With Your
            <span className="block text-secondary">Favorite Tools</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            MindMates integrates seamlessly with the tools you already use for a smooth study experience.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 text-center shadow-elegant hover:shadow-glow transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="h-16 flex items-center justify-center mb-4">
                  <img
                    src={integration.logo}
                    alt={integration.name}
                    className="max-w-12 max-h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{integration.name}</h3>
                <p className="text-xs text-muted-foreground">{integration.description}</p>
              </div>
            ))}
          </div>

          {/* API Access */}
          <div className="mt-16 text-center">
            <div className="bg-card rounded-3xl p-8 shadow-elegant max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Developer API Coming Soon
              </h3>
              <p className="text-muted-foreground mb-6">
                Build custom integrations and extend MindMates functionality with our upcoming REST API and webhooks.
              </p>
              <button className="btn-secondary">
                Join API Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;