/* jshint jasmine: true */
'use strict';
const layerBuilder = require('../src/layer.js');

describe('Layer', () => {
    let layer;
    const mockEsri = {
        FeatureLayer: Object,
        SpatialReference: Object
    };
    const mockGapi = {
        proj: {
            getProjection: () => Promise.resolve(null),
            projectGeojson: () => { return; }
        },
        shared: { generateUUID: () => 'layer0' }
    };
    beforeEach(() => {
        layer = layerBuilder(mockEsri, mockGapi);
    });

    it('should use 4326 as a default projection for GeoJSON', (done) => {
        const geojsonTestPoint = require('./geojsonTestPoint.json');
        spyOn(mockGapi.proj, 'projectGeojson');
        const res = layer.makeGeoJsonLayer(geojsonTestPoint, {targetWkid: 54004});
        res.then(x => {
            const args = mockGapi.proj.projectGeojson.calls.mostRecent().args;
            expect(args[1]).toEqual('EPSG:54004');
            expect(args[2]).toEqual('EPSG:4326');
            done();
        })
        .catch(e => {
            fail(`Exception was thrown: ${e}`);
            done();
        });
    });

});
