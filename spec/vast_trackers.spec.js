import { VASTClient } from '../src/vast_client';
import { VASTTracker } from '../src/vast_tracker';
import { inlineTrackersParsed } from '../spec/samples/inline_trackers';

const vastClient = new VASTClient();

describe('VASTTracker', function() {
  let vastTracker = null;

  describe('#linear', () => {
    let spyEmitter;
    let spyTrackUrl;
    let adTrackingUrls;
    let ad;
    const expectedMacros = {
      ASSETURI: 'http%3A%2F%2Fexample.com%2Flinear-asset.mp4',
      UNIVERSALADID: 'sample-registry%20000123',
      PODSEQUENCE: '1',
      ADSERVINGID: 'z292x16y-3d7f-6440-bd29-2ec0f153fc89',
      ADTYPE: 'video',
      ADCATEGORIES: 'Category-A%2CCategory-B%2CCategory-C'
    };
    beforeEach(() => {
      ad = inlineTrackersParsed.ads[0];
      adTrackingUrls = ad.creatives[0].trackingEvents;
      vastTracker = new VASTTracker(vastClient, ad, ad.creatives[0]);
      spyEmitter = jest.spyOn(vastTracker, 'emit');
      spyTrackUrl = jest.spyOn(vastTracker, 'trackURLs');
    });

    describe('#click', () => {
      beforeEach(() => {
        vastTracker.setProgress(60 * 75 + 5.25);
        vastTracker.click();
      });
      it('should have emitted click event and called trackUrl', () => {
        expect(spyEmitter).toHaveBeenCalledWith(
          'clickthrough',
          'http://example.com/linear-clickthrough_adplayhead:01%3A15%3A05.250'
        );

        expect(spyTrackUrl).toHaveBeenCalledWith(
          ad.creatives[0].videoClickTrackingURLTemplates,
          expect.objectContaining({
            ...expectedMacros,
            ADPLAYHEAD: '01%3A15%3A05.250'
          })
        );
      });
    });

    describe('#minimize', () => {
      beforeEach(() => {
        vastTracker.minimize();
      });
      it('should be defined', () => {
        expect(adTrackingUrls.minimize).toBeDefined();
      });
      it('should have emitted minimize event and called trackUrl', () => {
        expect(spyEmitter).toHaveBeenCalledWith('minimize', {
          trackingURLTemplates: adTrackingUrls.minimize
        });

        expect(spyTrackUrl).toHaveBeenCalledWith(
          adTrackingUrls.minimize,
          expect.objectContaining(expectedMacros)
        );
      });
    });

    describe('#verificationNotExecuted', () => {
      let verificationUrl;
      let reasonMacro = { REASON: 3 };
      const vendor = 'company.com-omid';
      beforeEach(() => {
        verificationUrl =
          ad.adVerifications[0].trackingEvents.verificationNotExecuted;
        vastTracker.verificationNotExecuted(vendor, reasonMacro);
      });
      it('should be defined', () => {
        expect(verificationUrl).toBeDefined();
      });
      it('should have emitted verificationNotExecuted event and called trackUrl', () => {
        expect(spyTrackUrl).toHaveBeenCalledWith(
          verificationUrl,
          expect.objectContaining(reasonMacro)
        );
        expect(spyEmitter).toHaveBeenCalledWith('verificationNotExecuted', {
          trackingURLTemplates: verificationUrl
        });
      });
      it('should throw missing AdVerification vendor error', () => {
        const vendor = ad.adVerifications[0].vendor;
        ad.adVerifications[0].vendor = null;
        expect(() => {
          vastTracker.verificationNotExecuted(vendor, reasonMacro);
        }).toThrowError(
          'No associated verification element found for vendor: company.com-omid'
        );
        ad.adVerifications[0].vendor = vendor;
      });
      it('should throw missing AdVerification error', () => {
        ad.adVerifications.length = 0;
        expect(() => {
          vastTracker.verificationNotExecuted(vendor, reasonMacro);
        }).toThrowError('No adVerifications provided');
      });
    });

    describe('#otherAdInteraction', () => {
      beforeEach(() => {
        vastTracker.otherAdInteraction();
      });
      it('should be defined', () => {
        expect(adTrackingUrls.otherAdInteraction).toBeDefined();
      });
      it('should have emitted otherAdInteraction event and called trackUrl', () => {
        expect(spyEmitter).toHaveBeenCalledWith('otherAdInteraction', {
          trackingURLTemplates: adTrackingUrls.otherAdInteraction
        });
        expect(spyTrackUrl).toHaveBeenCalledWith(
          adTrackingUrls.otherAdInteraction,
          expect.objectContaining(expectedMacros)
        );
      });
    });

    describe('#acceptInvitation', () => {
      beforeEach(() => {
        vastTracker.acceptInvitation();
      });
      it('should be defined', () => {
        expect(adTrackingUrls.acceptInvitation).toBeDefined();
      });
      it('should have emitted acceptInvitation event and called trackUrl', () => {
        expect(spyEmitter).toHaveBeenCalledWith('acceptInvitation', {
          trackingURLTemplates: adTrackingUrls.acceptInvitation
        });
        expect(spyTrackUrl).toHaveBeenCalledWith(
          adTrackingUrls.acceptInvitation,
          expect.objectContaining(expectedMacros)
        );
      });
    });

    describe('#adExpand', () => {
      beforeEach(() => {
        vastTracker.adExpand();
      });
      it('should be defined', () => {
        expect(adTrackingUrls.adExpand).toBeDefined();
      });
      it('should have emitted adExpand event and called trackUrl', () => {
        expect(spyEmitter).toHaveBeenCalledWith('adExpand', {
          trackingURLTemplates: adTrackingUrls.adExpand
        });
        expect(spyTrackUrl).toHaveBeenCalledWith(
          adTrackingUrls.adExpand,
          expect.objectContaining(expectedMacros)
        );
      });
    });

    describe('#adCollapse', () => {
      beforeEach(() => {
        vastTracker.adCollapse();
      });
      it('should be defined', () => {
        expect(adTrackingUrls.adCollapse).toBeDefined();
      });
      it('should have emitted adCollapse event and called trackUrl', () => {
        expect(spyEmitter).toHaveBeenCalledWith('adCollapse', {
          trackingURLTemplates: adTrackingUrls.adCollapse
        });
        expect(spyTrackUrl).toHaveBeenCalledWith(
          adTrackingUrls.adCollapse,
          expect.objectContaining(expectedMacros)
        );
      });
    });

    describe('#overlayViewDuration', () => {
      beforeEach(() => {
        vastTracker.overlayViewDuration('00:00:30', {
          CONTENTPLAYHEAD: '00:00:40',
          MEDIAPLAYHEAD: '00:00:40'
        });
      });
      it('should be defined', () => {
        expect(adTrackingUrls.overlayViewDuration).toBeDefined();
      });
      it('should have emitted adExpand event and called trackUrl', () => {
        expect(spyEmitter).toHaveBeenCalledWith('overlayViewDuration', {
          trackingURLTemplates: adTrackingUrls.overlayViewDuration
        });
        expect(spyTrackUrl).toHaveBeenCalledWith(
          adTrackingUrls.overlayViewDuration,
          expect.objectContaining({
            ...expectedMacros,
            ADPLAYHEAD: '00%3A00%3A30',
            CONTENTPLAYHEAD: '00%3A00%3A40',
            MEDIAPLAYHEAD: '00%3A00%3A40'
          })
        );
      });
    });

    describe('#notUsed', () => {
      it('should be defined', () => {
        expect(adTrackingUrls.notUsed).toBeDefined();
      });
      it('should have emitted adExpand event, called trackUrl and not emitted any other event', () => {
        vastTracker.notUsed();
        vastTracker.adCollapse();

        expect(spyEmitter).toHaveBeenCalledWith('notUsed', {
          trackingURLTemplates: adTrackingUrls.notUsed
        });
        expect(spyTrackUrl).toHaveBeenCalledWith(
          adTrackingUrls.notUsed,
          expect.objectContaining(expectedMacros)
        );
        expect(spyEmitter).toHaveBeenCalledTimes(1);
      });
    });

    describe('setProgress', () => {
      let spyTrack;
      let lastMock;
      beforeEach(() => {
        spyTrack = jest.spyOn(vastTracker, 'track');
        vastTracker.assetDuration = 10;
        //  vastTracker.lastDuration = 40;
        vastTracker.setProgress(5);
      });
      it('call track with progress-5', () => {
        expect(spyTrack).toHaveBeenCalledWith('progress-5', expect.anything());
      });

      it('call track with progress-50%', () => {
        expect(spyTrack).toHaveBeenCalledWith(
          'progress-50%',
          expect.anything()
        );
      });
      it('should have a lastPercentage variable', () => {
        expect(vastTracker.lastPercentage).toBeDefined();
      });
    });
  });
});
