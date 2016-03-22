/// <reference path="../node_modules/phaser/typescript/phaser.comments.d.ts" />

interface Child {
    firstname: string;
    lastname: string;
    language: string;
}

interface Settings {
    show_hint: boolean;
    hint_duration: number;
}

interface Asset {
    name: string;
    path: string;
    type: string;
}

interface GameItem {
    id: string;
    kind: string;
    audio: string;
    object: string;
    object_img: string;
    image: string;
    steps: Array<Array<Phaser.Point>>;
}

interface GameLayoutAxisEntry {
    multiplier: number;
    constant: number;
}

interface QuestionLayout {
    anchor: Phaser.Point;
    x: GameLayoutAxisEntry;
    y: GameLayoutAxisEntry;
}

interface OtsimoGame {
    session_step: number;
    items: string;

    scene_leave_duration: number;
    scene_enter_duration: number;

    balloon_options: any;
    question_layout: QuestionLayout;
}

interface KeyValue {
    preload: Array<Asset>;
    alphabet: Array<GameItem>;
    game: OtsimoGame;
    announceTextStyle: any;
    announceText: string;
    homeBackgroundColor: string;
}

interface Manifest {
    unique_name: string;
    version: string;
}

declare namespace otsimo {

    var debug: boolean;
    var sound: boolean;
    var child: Child;
    var width: number;
    var height: number;
    var settings: Settings;
    var iOS: boolean;
    var manifest: Manifest;
    var kv: KeyValue;

    var game: Phaser.Game;

    function quitgame(): void;

    function customevent(event: string, payload: Object): void;

    function log(str: string): void;

    function init(): void;

    function run(callback: Function): void;

    function onSettingsChanged(callback: Function): void;

}

declare module "otsimo" {
    export = otsimo;
}