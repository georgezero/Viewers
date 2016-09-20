import { OHIF } from 'meteor/ohif:core';

Template.viewerMain.onCreated(() => {
    // Attach the Window resize listener
    $(window).on('resize', handleResize);

    // Create the synchronizer used to update reference lines
    OHIF.viewer.updateImageSynchronizer = new cornerstoneTools.Synchronizer('CornerstoneNewImage', cornerstoneTools.updateImageSynchronizer);
});

Template.viewerMain.onRendered(() => {
    const instance = Template.instance();

    instance.subscribe('hangingprotocols', () => {
        const studies = instance.data.studies;
        const parentElement = instance.$('#layoutManagerTarget').get(0);
        window.layoutManager = new LayoutManager(parentElement, studies);

        ProtocolEngine = new HP.ProtocolEngine(window.layoutManager, studies);
        HP.setEngine(ProtocolEngine);

        // Enable hotkeys
        enableHotkeys();
    });
});

Template.viewerMain.onDestroyed(() => {
    OHIF.log.info('viewerMain onDestroyed');

    // Remove the Window resize listener
    $(window).off('resize', handleResize);

    // Destroy the synchronizer used to update reference lines
    OHIF.viewer.updateImageSynchronizer.destroy();

    delete window.layoutManager;
    delete ProtocolEngine;
});
