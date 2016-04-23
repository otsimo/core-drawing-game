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

interface ImageRef {
    atlas_or_image: string;
    frame: string;
}

interface GameItem {
    id: string;
    kind: string;
    audio: string;
    object: string;
    object_img: string;
    object_frame: string;
    image: string;
    frame: string;
    steps: Array<Array<Phaser.Point>>;
}

interface GameLayoutAxisEntry {
    multiplier: number;
    constant: number;
}

interface MaxSizeConstraint {
    width: GameLayoutAxisEntry;
    height: GameLayoutAxisEntry;
}

interface Constraint {
    anchor: Phaser.Point;
    x: GameLayoutAxisEntry;
    y: GameLayoutAxisEntry;
}

interface LoadingScreen {
    text: string,
    font: string;
    text_color: string;
    text_constraint: Constraint;
    background_color: string;
    image_path: string;
    only_image: boolean;
}

interface HomeScreen {
    background_color: string;
    background_image: string;
    play_btn_constraint: Constraint;
}

interface OverScreen {
    background_color: string;
    background_image: string;
}

interface IntroText {
    text: string;
    audio: string;
    style: string;
    position: Constraint;
}

interface Intro {
    pages: Array<Array<IntroText>>;
    styles: Object;
    question_constraint: Constraint;
    question_small_constraint: Constraint;
    question_small_size: MaxSizeConstraint;

    text_enter_duration: number;
    duration_each: number;
}

interface PlayScreen {
    background_color: string;
    background_image: string;
    intro: Intro;
    bucket_constraint: Constraint;
    bucket: ImageRef;
    bucket_star_x: number;
    bucket_star_y: number;
    bucket_star_width: number;
    bucket_star_height: number;
    paint_constraint: Constraint;
}

interface OtsimoGame {
    session_step: number;
    items: string;

    scene_leave_duration: number;
    scene_enter_duration: number;

    balloon_options: any;
    question_constraint: Constraint;
    back_btn_constraint: Constraint;
    back_btn_image: string;
}

interface KeyValue {
    preload: Array<Asset>;
    alphabet: Array<GameItem>;
    game: OtsimoGame;

    loading_screen: LoadingScreen;
    home_screen: HomeScreen;
    play_screen: PlayScreen;
    over_screen: OverScreen;
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