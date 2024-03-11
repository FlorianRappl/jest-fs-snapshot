import asar from 'asar';
import asarDisk from 'asar/lib/disk';
import {getDirectoryTree} from './tree';

export function getAsarTree(archive) {
    return asarDisk.readArchiveHeaderSync(archive).header;
}

export function createAsarPackage(src, dest, {exclude, ...options} = {}) {
    const files = [];
    const metadata = {};
    function callback(path, stat) {
        let type;
        if (stat.isDirectory()) {
            type = 'directory';
        }
        if (stat.isFile()) {
            type = 'file';
        }
        if (stat.isSymbolicLink()) {
            type = 'symbolic';
        }

        if (!type) {
            throw new Error('ataatt');
        }

        files.push(path);
        metadata[path] = {type, stat};
    }

    getDirectoryTree(src, {exclude, callback});

    return asar.createPackageFromFiles(src, dest, files, metadata, options, err => (err ? reject(err) : resolve()));
}
